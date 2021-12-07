import { ObjectId } from "mongodb";

export default class Party {
  constructor(
    public verion: number,
    public created: string,
    public name: string,
    public desc: string,
    public fund: {
      type: string;
      amount: number;
    },
    public voter: {
      address: string;
    },
    public price: number,
    public category: string,
    public id?: ObjectId
  ) {}
}
