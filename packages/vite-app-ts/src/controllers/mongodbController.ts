import { AxiosResponse } from 'axios';
import HttpController from '~~/controllers/httpController';
import { PartyType } from '~~/models/PartyModels';

export default class MongoDBController {
  http = new HttpController();
  async newParty(data: PartyType): Promise<AxiosResponse> {
    const url = 'http://localhost:8080/party';
    return this.http.post(url, {}, data); // Clean this up
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
