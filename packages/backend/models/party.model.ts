import { ObjectId } from "mongodb";
import { Ballot, Party } from "../../vite-app-ts/src/models/PartyModels";

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
