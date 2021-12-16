import { Card, Space } from 'antd';
import React, { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { StaticJsonRpcProvider } from '@ethersproject/providers';
import MongoDBController from '~~/controllers/mongodbController';
import { Vote, Distrbute } from './components';
export interface PartyProps {
  mainnetProvider: StaticJsonRpcProvider;
  yourCurrentBalance: any;
  price: number;
  setRoute: React.Dispatch<React.SetStateAction<string>>;
  readContracts: any;
  writeContracts: any;
}

export const Party: FC<PartyProps> = (props) => {
  const { id } = useParams<{ id: string }>();
  const [partyData, setPartyData] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const db = new MongoDBController();

  useEffect(() => {
    db.fetchParty(id)
      .then((res: any) => {
        setPartyData(res.data);
      })
      .catch((err: any) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // switch case for view component

  return (
    <div style={{ padding: 24 }}>
      <Space align="center">
        <Card title={id} loading={loading} style={{ minWidth: '324px', maxWidth: '60vw', width: '60vw' }}>
          {JSON.stringify(partyData, null, '\t')}
          <Vote readContracts={props.readContracts} partyData={partyData} id={id} />
          <Distrbute
            partyData={partyData}
            mainnetProvider={props.mainnetProvider}
            yourCurrentBalance={props.yourCurrentBalance}
            price={props.price}
            readContracts={props.readContracts}
            writeContracts={props.writeContracts}
            id={id}
          />
        </Card>
      </Space>
    </div>
  );
};
