import { Button, Space, Input } from 'antd';
import { FC, useState } from 'react';
import { useEthersContext } from 'eth-hooks/context';
import MongoDBController from '~~/controllers/mongodbController';
import { TypedDataDomain, TypedDataField } from '@ethersproject/abstract-signer';
import { Ballot, Votes } from '~~/models/PartyModels';
const { TextArea } = Input;
export interface VoteProps {
  readContracts: any;
  partyData: any;
  id: string;
}

export const Vote: FC<VoteProps> = (props) => {
  const ethersContext = useEthersContext();
  const [loading, setLoading] = useState<boolean>(true);
  const [votesData, setVotesData] = useState<Votes | null>(null);

  const db = new MongoDBController();

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
      party: props.partyData.name,
      ballot: {
        address: ethersContext.account,
        votes: JSON.stringify(votesData),
      },
    };

    if (props.partyData.ballots.valueOf(ethersContext.account).length < 1) {
      // Check if account has already submitted a ballot
      // NOTE: sign typed data for eip712 is underscored because it's in public beta
      ethersContext.signer
        ?._signTypedData(domain, types, ballot)
        .then((sig: string) => {
          const ballots = props.partyData.ballots;
          // Push a ballot to the parties sumbitted ballots array
          ballots.push({ signature: sig, data: ballot });
          return ballots;
        })
        .then((ballots: Ballot[]) => {
          db.updateParty(props.partyData._id, { ballots: ballots });
        })
        .catch((err: any) => {
          console.log(err);
        });
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <Space align="center">
        <TextArea rows={3} onChange={handleVotesChange} placeholder='{"0x00...": number, "0x01...": number}' />
        <Button onClick={vote}>Vote</Button>
      </Space>
    </div>
  );
};
