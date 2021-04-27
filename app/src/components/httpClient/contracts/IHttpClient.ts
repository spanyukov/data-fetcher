import { AxiosRequestConfig, AxiosResponse } from 'axios';

export interface IRequestConfig extends AxiosRequestConfig {
}

export interface IResponse extends AxiosResponse {
}

export interface IHttpClient {
    makeRequest(config: IRequestConfig): Promise<IResponse>;
    getClient(): any;
}