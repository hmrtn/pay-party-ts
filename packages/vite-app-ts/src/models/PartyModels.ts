import { ObjectId } from 'mongodb';

export interface Party {
  name?: string;
  desc?: string;
  fund?: {
    amount: number;
    token: string | null;
  };
  strategy?: string;
  participants?: string[];
  candidates?: string[];
  ballots?: Ballot[];
}

export interface Ballot {
  party: string;
  ballot: {
    address: string | undefined;
    votes: string; // Stringified Votes type
  };
}

export interface Votes {
  address: string;
  n: number;
}

export default class PartyObject implements Party {
  constructor(
    public name?: string,
    public desc?: string,
    public fund?: {
      amount: number;
      token: string | null;
    },
    public strategy?: string,
    public participants?: string[],
    public candidates?: string[],
    public ballots?: Ballot[],
    public id?: ObjectId
  ) {}
}
