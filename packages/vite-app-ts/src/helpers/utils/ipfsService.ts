import axios, { AxiosResponse } from 'axios';

interface Opts {
  url: string;
  params: { [key: string]: any };
  body: any;
  headers: { [key: string]: any };
  asFormEncoded: boolean;
}

class HttpService {
  async get(
    baseURL: string,
    endpoint?: string,
    params?: { [key: string]: any },
    headers?: { [key: string]: any }
  ): Promise<AxiosResponse> {
    const url = endpoint ? baseURL.concat(endpoint) : baseURL;
    const options = { params, headers };
    return axios.get(url, options);
  }
  async post(
    baseURL: string,
    params?: { [key: string]: any },
    body?: any,
    headers?: { [key: string]: any },
    asFormEncoded?: boolean
  ): Promise<AxiosResponse> {
    const url = baseURL;
    const options = {
      params,
      headers,
      auth: {
        username: import.meta.env.VITE_APP_INFURA_IPFS_PROJECT_ID,
        password: import.meta.env.VITE_APP_INFURA_IPFS_PROJECT_KEY,
      },
    };
    if (asFormEncoded && body) {
      const bodyParams = new URLSearchParams();
      for (const b of Object.keys(body)) {
        bodyParams.append(b, body[b]);
      }
      body = bodyParams;
    }
    return axios.post(url, body, options);
  }
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
