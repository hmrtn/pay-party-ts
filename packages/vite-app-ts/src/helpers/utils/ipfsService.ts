import axios, { AxiosResponse } from 'axios';
import HttpService from '~~/helpers/utils/httpService';

interface Opts {
  url: string;
  params: { [key: string]: any };
  body: any;
  headers: { [key: string]: any };
  asFormEncoded: boolean;
}
export default class InfuraIpfsService {
  http = new HttpService();
  async cat(hash: string): Promise<AxiosResponse> {
    const url = 'https://ipfs.infura.io:5001/api/v0/cat';
    return this.http.post(url, { arg: hash });
  }
  // async get(hash: string): Promise<AxiosResponse> {}
  // async add(hash: string): Promise<AxiosResponse> {
  //   const url = '';
  //   return this.http.post('https://ipfs.infura.io:5001/api/v0/add');
  // }
  // async pin(hash: string): Promise<AxiosResponse> {}
}
