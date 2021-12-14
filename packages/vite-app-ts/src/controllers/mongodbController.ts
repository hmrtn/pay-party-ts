import { AxiosResponse } from 'axios';
import HttpController from '~~/controllers/httpController';
import { Party } from '~~/models/PartyModels';

export default class MongoDBController {
  http = new HttpController();
  async newParty(data: Party): Promise<AxiosResponse> {
    const url = 'http://localhost:8080/party';
    const party = data;
    return this.http.post(url, {}, party); // Clean this up
  }
  async fetchAllParties(): Promise<AxiosResponse> {
    const url = 'http://localhost:8080/party';
    return this.http.get(url);
  }
  async fetchParty(id: string): Promise<AxiosResponse> {
    const url = `http://localhost:8080/party/${id}`;
    return this.http.get(url);
  }
  async updateParty(id: string, data: any): Promise<AxiosResponse> {
    const url = `http://localhost:8080/party/${id}`;
    return this.http.put(url, data);
  }
}
