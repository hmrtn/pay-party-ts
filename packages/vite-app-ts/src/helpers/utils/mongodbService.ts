import { AxiosResponse } from 'axios';
import HttpService from '~~/helpers/utils/httpService';

export default class MongoDBService {
  http = new HttpService();
  async test(): Promise<AxiosResponse> {
    const url = 'http://localhost:8080/parties';
    return this.http.get(url);
  }
}
