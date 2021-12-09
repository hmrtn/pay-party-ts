import axios, { AxiosResponse } from 'axios';
// This helper class is meant to serve as a flexible HTTP service
export default class HttpController {
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
    };
    if (asFormEncoded && body) {
      const bodyParams = new URLSearchParams();
      for (const b of Object.keys(body)) {
        bodyParams.append(b, body[b]);
      }
      body = bodyParams;
    }
    console.log('httpController.post');
    return axios.post(url, body, options);
  }
  async put(
    baseURL: string,
    data?: any, // object!
    params?: { [key: string]: any },
    headers?: { [key: string]: any }
  ): Promise<AxiosResponse> {
    const url = baseURL;
    const options = {
      params,
      headers,
    };
    return axios.put(url, data, options);
  }
}
