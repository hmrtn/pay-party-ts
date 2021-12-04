import { SyncOutlined } from '@ant-design/icons';
import { formatEther, parseEther } from '@ethersproject/units';
import { Button, Card, Tag, DatePicker, Divider, Input, List, Progress, Slider, Spin, Switch } from 'antd';
import { Signer, Contract } from 'ethers';
import React, { useState, FC, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Address, Balance } from 'eth-components/ant';
import { transactor, TTransactor } from 'eth-components/functions';
import { StaticJsonRpcProvider } from '@ethersproject/providers';
import { useEthersContext } from 'eth-hooks/context';
import { useContractLoader, useContractReader, useEventListener, useGasPrice } from 'eth-hooks';
import { YourContract } from '~~/generated/contract-types';
import { useAppContracts } from '~~/app/routes/main/hooks/useAppContracts';
import { EthComponentsSettingsContext } from 'eth-components/models';

export interface HomeProps {
  mainnetProvider: StaticJsonRpcProvider;
  yourCurrentBalance: any;
  price: number;
  setRoute: React.Dispatch<React.SetStateAction<string>>;
}

export const Home: FC<HomeProps> = (props) => {
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

  //   const { mainnetProvider, yourCurrentBalance, price, setRoute } = props;

  return (
    <div style={{ padding: 24 }}>
      <div>
        <Link
          to="/create"
          onClick={() => {
            props.setRoute('/create');
          }}>
          Create
        </Link>
      </div>
      <div>
        <Card title="Example Election 1" extra={<a href="#">View</a>} style={{ width: 300 }}>
          <Tag color="green">Active</Tag>
          <Tag color="blue">Voter</Tag>
          <Tag color="volcano">Candidate</Tag>
          <p>Card content</p>
          <p>Card content</p>
          <p>Card content</p>
        </Card>
      </div>
    </div>
  );
};
