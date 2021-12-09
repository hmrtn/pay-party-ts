import { Card, Tag, Space } from 'antd';
import React, { FC, useContext, useEffect, useState } from 'react';
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

export const Home: FC<HomeProps> = (props) => {
  const ethersContext = useEthersContext();

  const ethComponentsSettings = useContext(EthComponentsSettingsContext);
  const gasPrice = useGasPrice(ethersContext.chainId, 'fast');
  const tx = transactor(ethComponentsSettings, ethersContext?.signer, gasPrice);

  const [state, setstate] = useState<any | null>(null);

  const db = new MongoDBController();

  useEffect(() => {
    db.fetchAllParties()
      .then((res: any) => {
        setstate(res.data);
      })
      .catch((err: any) => {
        console.log(err);
      });
  }, []);

  // URL hook for elections reload
  const history = useHistory();

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
      {state &&
        state.map((d: any) => (
          <Space size={[8, 16]} align="baseline" wrap>
            <div style={{ padding: 16 }}>
              <Card title={d.name} extra={<Link to={`/party/${d._id}`}>View</Link>} style={{ width: 324 }}>
                <Tag color="green">Active</Tag>
                <Tag color="blue">Voter</Tag>
                <Tag color="volcano">Candidate</Tag>
                <p>{d.desc}</p>
                <p>Card content</p>
                <p>Card content</p>
              </Card>
            </div>
          </Space>
        ))}
    </div>
  );
};
