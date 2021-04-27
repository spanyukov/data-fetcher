import {inject, injectable} from 'inversify';
import {DI_TYPES_ALL} from '../../DITypes';
import {IHttpClient, IRequestConfig, IResponse} from './contracts/IHttpClient';

@injectable()
export class HttpClient implements IHttpClient {
    constructor(@inject(DI_TYPES_ALL.HttpClient) private _client: any) {
    }

    public get HttpClient(): any {
        return this._client;
    }

    public getClient() {
        return this._client;
    }

    public async makeRequest(config: IRequestConfig): Promise<IResponse> {
        return await this._client(config);
    }

}