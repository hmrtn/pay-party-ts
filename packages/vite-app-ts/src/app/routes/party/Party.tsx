import { Card, Space } from 'antd';
import React, { FC, useContext, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { transactor } from 'eth-components/functions';
import { StaticJsonRpcProvider } from '@ethersproject/providers';
import { useEthersContext } from 'eth-hooks/context';
import { useGasPrice } from 'eth-hooks';
import { EthComponentsSettingsContext } from 'eth-components/models';
import MongoDBController from '~~/controllers/mongodbController';

export interface PartyProps {
  mainnetProvider: StaticJsonRpcProvider;
  yourCurrentBalance: any;
  price: number;
  setRoute: React.Dispatch<React.SetStateAction<string>>;
}

export const Party: FC<PartyProps> = (props) => {
  const ethersContext = useEthersContext();

  const ethComponentsSettings = useContext(EthComponentsSettingsContext);
  const gasPrice = useGasPrice(ethersContext.chainId, 'fast');
  const tx = transactor(ethComponentsSettings, ethersContext?.signer, gasPrice);

  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const db = new MongoDBController();

  useEffect(() => {
    db.fetchParty(id)
      .then((res: any) => {
        console.log(res.data);
        setData(res.data);
        setLoading(false);
      })
      .catch((err: any) => {
        console.log(err);
      });
  }, []);

  // URL hook for elections reload
  const history = useHistory();
  const { id } = useParams<{ id: string }>();
  console.log(id);

  return (
    <div style={{ padding: 24 }}>
      <Space align="center">
        <Card title={id} loading={loading} style={{ minWidth: '324px', maxWidth: '80vw', width: '80vw' }}>
          {JSON.stringify(data)}
        </Card>
      </Space>
    </div>
  );
};
