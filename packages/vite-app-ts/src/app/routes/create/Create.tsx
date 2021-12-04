import { SyncOutlined } from '@ant-design/icons';
import { formatEther, parseEther } from '@ethersproject/units';
import {
  Button,
  Form,
  Checkbox,
  Card,
  Tag,
  DatePicker,
  Divider,
  Input,
  List,
  Progress,
  Slider,
  Spin,
  Switch,
} from 'antd';
import { Signer, Contract } from 'ethers';
import React, { useState, FC, useContext } from 'react';
import { Address, Balance } from 'eth-components/ant';
import { transactor, TTransactor } from 'eth-components/functions';
import { StaticJsonRpcProvider } from '@ethersproject/providers';
import { useEthersContext } from 'eth-hooks/context';
import { useContractLoader, useContractReader, useEventListener, useGasPrice } from 'eth-hooks';
import { YourContract } from '~~/generated/contract-types';
import { useAppContracts } from '~~/app/routes/main/hooks/useAppContracts';
import { EthComponentsSettingsContext } from 'eth-components/models';
import IpfsHttpService from '~~/helpers/utils/ipfsHttpService';

export interface CreateProps {
  mainnetProvider: StaticJsonRpcProvider;
  yourCurrentBalance: any;
  price: number;
}

export const Create: FC<CreateProps> = (props) => {
  const [newPurpose, setNewPurpose] = useState('loading...');
  const ethersContext = useEthersContext();

  const appContractConfig = useAppContracts();
  const readContracts = useContractLoader(appContractConfig);
  const writeContracts = useContractLoader(appContractConfig, ethersContext?.signer);

  const yourContractRead = readContracts['YourContract'] as YourContract;
  const yourContractWrite = writeContracts['YourContract'] as YourContract;
  const purpose = useContractReader<string>(yourContractRead, {
    contractName: 'YourContract',
    functionName: 'purpose',
  });
  const setPurposeEvents = useEventListener(yourContractRead, 'SetPurpose', 1);

  const signer = ethersContext.signer;
  const address = ethersContext.account ?? '';

  const ethComponentsSettings = useContext(EthComponentsSettingsContext);
  const gasPrice = useGasPrice(ethersContext.chainId, 'fast');
  const tx = transactor(ethComponentsSettings, ethersContext?.signer, gasPrice);

  const { mainnetProvider, yourCurrentBalance, price } = props;

  type Options = {
    url: string;
  };

  const onFinish = async (values: any) => {
    console.log('Success:', values);

    const ipfs = new IpfsHttpService();
    console.log(ipfs.cat('https://ipfs.infura.io:5001/api/v0/cat', 'Qmb4EN4SrTLJtoXnoY4gTnEdWhfsnGp1GuJEEjMyRxKnac'));
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div style={{ padding: 24 }}>
      <div>
        <Card title="Create Pay Party" style={{ width: '30vw' }}>
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off">
            <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Name Required.' }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Description" name="desc" rules={[{ required: true, message: 'Description Required.' }]}>
              <Input />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};
