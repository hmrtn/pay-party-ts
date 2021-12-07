import { Card, Tag } from 'antd';
import React, { FC, useContext, useMemo, useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { transactor } from 'eth-components/functions';
import { StaticJsonRpcProvider } from '@ethersproject/providers';
import { useEthersContext } from 'eth-hooks/context';
import { useGasPrice } from 'eth-hooks';
import { EthComponentsSettingsContext } from 'eth-components/models';
import MongoDBController from '~~/controllers/mongodbController';
export interface HomeProps {
  mainnetProvider: StaticJsonRpcProvider;
  yourCurrentBalance: any;
  price: number;
  setRoute: React.Dispatch<React.SetStateAction<string>>;
}

const [parties, setParties] = useState([]);

export const Home: FC<HomeProps> = (props) => {
  const ethersContext = useEthersContext();

  const ethComponentsSettings = useContext(EthComponentsSettingsContext);
  const gasPrice = useGasPrice(ethersContext.chainId, 'fast');
  const tx = transactor(ethComponentsSettings, ethersContext?.signer, gasPrice);

  const loadParties = async () => {
    const db = new MongoDBController();
    return db.allParties();
  };

  // URL hook for elections reload
  const history = useHistory();

  useEffect(() => {
    // TODO: Load the parties
  }, [history]);

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
