// import 'dotenv/config'

import axios, { AxiosResponse } from 'axios';

export default class IpfsHttpService {
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
    endpoint?: string,
    body?: any,
    // params?: { [key: string]: any },
    headers?: { [key: string]: any },
    asFormEncoded?: boolean
  ): Promise<AxiosResponse> {
    
    const url = endpoint ? baseURL.concat(endpoint) : baseURL;
    const options = {
      params: {
        arg: 'Qmb4EN4SrTLJtoXnoY4gTnEdWhfsnGp1GuJEEjMyRxKnac',
      },
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

  async cat(
    baseURL: string,
    hash: string, 
    endpoint?: string,
    body?: any,
    // params?: { [key: string]: any },
    headers?: { [key: string]: any },
    asFormEncoded?: boolean, 
  ): Promise<AxiosResponse> {
    
    const url = endpoint ? baseURL.concat(endpoint) : baseURL;
    const options = {
      params: {
        arg: hash,
      },
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