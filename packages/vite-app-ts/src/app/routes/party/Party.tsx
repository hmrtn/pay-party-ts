import { Button, Card, Space } from 'antd';
import React, { FC, useContext, useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { transactor } from 'eth-components/functions';
import { isCommunityResourcable, StaticJsonRpcProvider } from '@ethersproject/providers';
import { useEthersContext } from 'eth-hooks/context';
import { useGasPrice } from 'eth-hooks';
import { EthComponentsSettingsContext } from 'eth-components/models';
import MongoDBController from '~~/controllers/mongodbController';
import { ethers } from 'ethers';

export interface PartyProps {
  mainnetProvider: StaticJsonRpcProvider;
  yourCurrentBalance: any;
  price: number;
  setRoute: React.Dispatch<React.SetStateAction<string>>;
  readContracts: any;
}

export const Party: FC<PartyProps> = (props) => {
  const { id } = useParams<{ id: string }>();
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
      })
      .catch((err: any) => {
        console.log(err);
        // setData()
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const vote = async (party: any) => {
    // EIP 712
    const domain = {
      name: import.meta.env.VITE_APP_NAME,
      version: '1',
      chainId: ethersContext.chainId,
      verifyingContract: props.readContracts.Distributor.address,
    };

    const types = {
      Vote: [
        // { name: 'from', type: 'User' },
        { name: 'ballot', type: 'string' },
        // { name: 'chainId', type: 'number' },
      ],
      // User: [{ name: 'wallet', type: 'address' }],
    };

    const ballot = {
      // from: {
      //   wallet: '0x1111111111111111111111111111111111111100',
      // },
      ballot: JSON.stringify({ addr1: 1, addr2: 5, addr3: 3 }),
      // chainId: ethersContext.chainId,
      // timestamp: ethers.block.number,
    };
    // End EIP 712

    // EIP-712 Typed Data
    // See: https://eips.ethereum.org/EIPS/eip-712
    ethersContext.signer
      ?._signTypedData(domain, types, ballot)
      .then((sig: string) => {
        party.ballots.push({ account: ethersContext.account, signature: sig, ballot: ballot });
        console.log(party);
      })
      .catch((err: any) => {
        console.log(err);
      })
      .finally(() => {
        console.log(party);
        ethers.utils.verifyMessage(party.ballots[0].signature, party.ballots[0].ballot.ballot);
        // console.log(verifyVote());
      });
    // console.log(ethersContext);
    // console.log(party);
  };

  const verifyVote = (msg: string, sig: string) => {
    ethers.utils.verifyMessage(msg, sig);
  };

  return (
    <div style={{ padding: 24 }}>
      <Space align="center">
        <Card title={id} loading={loading} style={{ minWidth: '324px', maxWidth: '80vw', width: '80vw' }}>
          {JSON.stringify(data)}
          <Button onClick={() => vote(data)}>Vote Sign Test</Button>
        </Card>
      </Space>
    </div>
  );
};
