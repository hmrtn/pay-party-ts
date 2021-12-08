import { Axios, AxiosResponse } from 'axios';
import { threadId } from 'worker_threads';
import HttpController from '~~/controllers/httpController';

export default class MongoDBController {
  http = new HttpController();
  async test(): Promise<AxiosResponse> {
    const url = 'http://localhost:8080/party';
    return this.http.get(url);
  }
  async newParty(d: JSON): Promise<AxiosResponse> {
    const url = 'http://localhost:8080/party';
    console.log('newParty');
    return this.http.post(url, {}, d);
  }
  async allParties(): Promise<AxiosResponse> {
    const url = 'http://localhost:8080/party';
    return this.http.get(url);
  }
  async fetchParty(id: string): Promise<AxiosResponse> {
    const url = `http://localhost:8080/party/${id}`;
    return this.http.get(url);
  }
}
