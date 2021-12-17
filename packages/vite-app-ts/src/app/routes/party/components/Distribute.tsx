import { Button, Input, Form, InputNumber } from 'antd';
import { FC, useEffect, useState } from 'react';
import { StaticJsonRpcProvider } from '@ethersproject/providers';
import { useEthersContext } from 'eth-hooks/context';
import { toWei } from 'web3-utils';
import { BigNumber, ContractInterface, ethers } from 'ethers';
import $ from 'jquery';
import FormItem from 'antd/lib/form/FormItem';
import MongoDBController from '~~/controllers/mongodbController';
import { Receipt } from '~~/models/PartyModels';
const { TextArea } = Input;
export interface DistributeProps {
  partyData: any;
  mainnetProvider: StaticJsonRpcProvider;
  yourCurrentBalance: any;
  price: number;
  readContracts: any;
  writeContracts: any;
  id: string;
}

export const Distribute: FC<DistributeProps> = (props) => {
  const ethersContext = useEthersContext();
  const [tokenInstance, setTokenInstance] = useState<ethers.Contract | null>(null);
  const [amounts, setAmounts] = useState<BigNumber>();
  const [total, setTotal] = useState<BigNumber>();
  const [distribution, setDistribution] = useState<any>();

  const db = new MongoDBController();

  // Calculate percent distribution from submitted ballots
  const calcDistribution = async () => {
    const votes: [] = props.partyData.ballots.map((b: any) => JSON.parse(b.data.ballot.votes));
    let sum = 0;
    let processed = [];
    for (let i = 0; i < props.partyData.candidates.length; i++) {
      const candidate = props.partyData.candidates[i];
      // Strategy handling
      if (props.partyData.config.strategy === 'Linear') {
        let c = votes.reduce((total, vote) => vote[candidate] + total, 0);
        sum += c;
        processed.push({ address: candidate, reduced: c });
      } else if (props.partyData.config.strategy === 'Quadratic') {
        let c = votes.reduce((total, vote) => vote[candidate] ** 0.5 + total, 0);
        sum += c;
        processed.push({ address: candidate, reduced: c });
      }
    }
    let final = [];
    for (let i = 0; i < props.partyData.candidates.length; i++) {
      const candidate = props.partyData.candidates[i];
      final.push({ address: candidate, score: processed[i].reduced / sum });
    }
    setDistribution(final);
  };

  // Calculate the distribution on load
  useEffect(() => {
    calcDistribution();
  }, []);

  // load an erc20
  // TODO: add capability for other block explorers
  const loadToken = async (values: any) => {
    $.getJSON(
      `https://api.etherscan.io/api?module=contract&action=getabi&address=${values.token}&${
        import.meta.env.VITE_APP_ETHERSCAN_KEY
      }`,
      (data: any) => {
        const contractABI: ContractInterface = JSON.parse(data.result);
        var contractInstance = new ethers.Contract(values.token, contractABI, ethersContext.signer);
        setTokenInstance(contractInstance);
      }
    );
    console.log(tokenInstance);
  };

  // Approve total token amount
  const approve = async () => {
    tokenInstance?.approve(tokenInstance.address, total);
  };

  // Update the distrubtion amounts when input total changes
  const handleAmountChange = (e: any) => {
    // TODO: validate correct form
    const amt = e;
    const amts: any = [];
    let tot: BigNumber = BigNumber.from('0x00');
    for (let i = 0; i < props.partyData.candidates.length; i++) {
      const x = BigNumber.from(toWei((distribution[i].score * amt).toString()));
      amts.push(x);
      tot = tot.add(x);
    }
    setTotal(tot);
    setAmounts(amts);
  };

  // Distribute either Eth, or loaded erc20
  const distribute = async () => {
    if (props.partyData.ballots.length > 0) {
      // Distribute the funds
      const res = tokenInstance
        ? await props.writeContracts.Distributor.distributeToken(
            tokenInstance.address,
            props.partyData.candidates,
            amounts
          )
        : await props.writeContracts.Distributor.distributeEther(props.partyData.candidates, amounts, {
            value: total,
          });
      await res.wait(2);
      // Update the reciepts
      const receipt: Receipt = {
        account: ethersContext.account,
        amount: total,
        token: tokenInstance?.address,
        txn: res.hash,
      };
      const receipts = props.partyData.receipts;
      receipts.push(receipt);
      db.updateParty(props.partyData._id, { receipts: receipts });
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <Form onFinish={loadToken}>
        <Form.Item name="token" label="ERC20">
          <TextArea placeholder="token address"></TextArea>
        </Form.Item>
        <FormItem>
          <Button htmlType="submit">Load Token</Button>
        </FormItem>
      </Form>
      <Form>
        <Form.Item name="amount" label="Amount" rules={[{ required: true, message: 'Amount Required.' }]}>
          <InputNumber onChange={handleAmountChange}></InputNumber>
        </Form.Item>
      </Form>
      <Form>
        <FormItem>
          <Button onClick={approve}>Approve</Button>
          <Button onClick={distribute}>Distribute</Button>
        </FormItem>
      </Form>
    </div>
  );
};
