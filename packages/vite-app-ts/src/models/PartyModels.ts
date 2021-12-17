import { BigNumber } from 'ethers';
import { ObjectId } from 'mongodb';

export interface Config {
  strategy?: string;
  nvotes?: Number;
}
export interface Receipt {
  account?: string | undefined;
  amount?: BigNumber | undefined;
  token?: string | undefined;
  txn?: string | undefined;
}

export interface PartyType {
  name?: string;
  description?: string;
  receipts?: Receipt[];
  // strategy?: string;
  config?: Config;
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

export default class PartyObject implements PartyType {
  constructor(
    public name?: string,
    public description?: string,
    public receipts?: Receipt[],
    public config?: Config,
    // public strategy?: string,
    public participants?: string[],
    public candidates?: string[],
    public ballots?: Ballot[],
    public id?: ObjectId
  ) {}
}
