import { Button, Input, Form } from 'antd';
import { FC, useState } from 'react';
import { StaticJsonRpcProvider } from '@ethersproject/providers';
import { useEthersContext } from 'eth-hooks/context';
import { toWei } from 'web3-utils';
import { BigNumber, ContractInterface, ethers } from 'ethers';
import $ from 'jquery';
import FormItem from 'antd/lib/form/FormItem';
import MongoDBController from '~~/controllers/mongodbController';
import { Reciept } from '~~/models/PartyModels';
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

  const db = new MongoDBController();

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

  const handleAmountChange = (e: any) => {
    // TODO: validate correct form
    const amts = e.target.value
      .split(/[ ,]+/)
      .filter((amt: string) => amt !== '')
      .map((amt: string): BigNumber => BigNumber.from(toWei(amt)));

    let tot = BigNumber.from('0x00');
    for (let i = 0; i < amts.length; i++) {
      tot = tot.add(amts[i]);
    }
    setAmounts(amts);
    setTotal(tot);
  };

  const approve = async () => {
    tokenInstance?.approve(tokenInstance.address, total);
  };

  const distribute = async () => {
    // Distribute the funds
    const res = tokenInstance
      ? await props.writeContracts.Distributor.distributeToken(
          tokenInstance?.address,
          props.partyData.candidates,
          amounts
        )
      : await props.writeContracts.Distributor.distributeEther(props.partyData.candidates, amounts, {
          value: total,
        });
    await res.wait(2);
    // Update the reciepts
    const reciept: Reciept = {
      account: ethersContext.account,
      amount: total,
      token: tokenInstance?.address,
      txn: res.hash,
    };
    const reciepts = props.partyData.reciepts;
    db.updateParty(props.partyData._id, { reciepts: [...reciepts, reciept] });
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
          <TextArea placeholder="1, 1, 3, ..." onChange={handleAmountChange}></TextArea>
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
