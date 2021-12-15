import { Button, Space, Input, Form } from 'antd';
import { FC, useState } from 'react';
import { StaticJsonRpcProvider } from '@ethersproject/providers';
import { useEthersContext } from 'eth-hooks/context';
import { toWei } from 'web3-utils';
import { ContractInterface, ethers } from 'ethers';
import $ from 'jquery';
import FormItem from 'antd/lib/form/FormItem';
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
  const token = props.partyData.fund.token;
  const amount = toWei(props.partyData.fund.amount.toString());
  console.log(token, amount);
  const [tokenInstance, setTokenInstance] = useState<ethers.Contract | null>(null);
  const [button, setButton] = useState<string>('Loading...');

  const loadToken = async (token: string) => {
    $.getJSON(
      `https://api.etherscan.io/api?module=contract&action=getabi&address=${token}&${'F6XRF2BSH21RAD2YBJC6HQFJEPDV845DBQ'}`,
      (data: any) => {
        const contractABI: ContractInterface = JSON.parse(data.result);
        var contractInstance = new ethers.Contract(token, contractABI, ethersContext.signer);
        setTokenInstance(contractInstance);
      }
    );
    console.log(tokenInstance);
  };

  const approve = async () => {
    tokenInstance?.approve('0xde30da39c46104798bb5aa3fe8b9e0e1f348163f', amount);
  };

  const distribute = async () => {
    // props.writeContracts.Distributor.distributeToken(
    //   '0xde30da39c46104798bb5aa3fe8b9e0e1f348163f',
    //   props.partyData.candidates,
    //   ['100000']
    // );
  };

  return (
    <div style={{ padding: 24 }}>
      <Space align="center">
        <Form onFinish={approve}>
          <Form.Item>
            <TextArea placeholder="token address"></TextArea>
          </Form.Item>
          <FormItem>
            <Button onClick={() => loadToken(token)}>Load Token</Button>
            <Button onClick={approve}>Approve</Button>
            <Button onClick={distribute}>Distribute</Button>
          </FormItem>
        </Form>
      </Space>
    </div>
  );
};
