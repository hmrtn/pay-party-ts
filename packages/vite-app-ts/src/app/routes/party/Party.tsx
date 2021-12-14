import { Button, Card, Space, Input } from 'antd';
import React, { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { StaticJsonRpcProvider } from '@ethersproject/providers';
import { useEthersContext } from 'eth-hooks/context';
import MongoDBController from '~~/controllers/mongodbController';
import { TypedDataDomain, TypedDataField } from '@ethersproject/abstract-signer';
import { Ballot, Votes } from '~~/models/PartyModels';
const { TextArea } = Input;
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
  const [partyData, setPartyData] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [votesData, setVotesData] = useState<Votes | null>(null);

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

  const handleVotesChange = (e: any) => {
    const value: string = e.target.value;
    try {
      const parsedVotes: Votes = JSON.parse(value);
      setVotesData(parsedVotes);
    } catch (error) {
      console.log('Formatted JSON Required');
    }
  };

  const vote = async () => {
    // EIP-712 Typed Data
    // See: https://eips.ethereum.org/EIPS/eip-712
    const domain: TypedDataDomain = {
      name: 'pay-party',
      version: '1',
      chainId: ethersContext.chainId,
      verifyingContract: props.readContracts.Distributor.address,
    };
    const types: Record<string, Array<TypedDataField>> = {
      Party: [
        { name: 'party', type: 'string' },
        { name: 'ballot', type: 'Ballot' },
      ],
      Ballot: [
        { name: 'address', type: 'address' },
        { name: 'votes', type: 'string' },
      ],
    };

    const ballot: Ballot = {
      party: partyData.name,
      ballot: {
        address: ethersContext.account,
        votes: JSON.stringify(votesData),
      },
    };

    // NOTE: sign typed data for eip712 is underscored because it's in public beta
    ethersContext.signer
      ._signTypedData(domain, types, ballot)
      .then((sig: string) => {
        const ballots = partyData.ballots;
        // Push a ballot to the parties sumbitted ballots array
        ballots.push({ signature: sig, data: ballot });
        return ballots;
      })
      .then((ballots: Ballot[]) => {
        db.updateParty(partyData._id, { ballots: ballots });
      })
      .catch((err: any) => {
        console.log(err);
      });
  };

  return (
    <div style={{ padding: 24 }}>
      <Space align="center">
        <Card title={id} loading={loading} style={{ minWidth: '324px', maxWidth: '80vw', width: '80vw' }}>
          {JSON.stringify(partyData, null, '\t')}
          <TextArea rows={3} onChange={handleVotesChange} />
          <Button onClick={vote}>Vote</Button>
        </Card>
      </Space>
    </div>
  );
};
