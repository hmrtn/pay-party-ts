import { Axios, AxiosResponse } from 'axios';
import { threadId } from 'worker_threads';
import HttpController from '~~/controllers/httpController';

export default class MongoDBController {
  http = new HttpController();
  async newParty(d: any): Promise<AxiosResponse> {
    const url = 'http://localhost:8080/party';
    return this.http.post(url, {}, d); // Clean this up
  }
  async fetchAllParties(): Promise<AxiosResponse> {
    const url = 'http://localhost:8080/party';
    return this.http.get(url);
  }
  async fetchParty(id: string): Promise<AxiosResponse> {
    const url = `http://localhost:8080/party/${id}`;
    return this.http.get(url);
  }
  async castBallot(id: string, ballot: any): Promise<AxiosResponse> {
    const url = `http://localhost:8080/party/${id}`;
    return this.http.put(url, ballot);
  }
}
