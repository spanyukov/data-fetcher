import {inject, injectable} from 'inversify';
import {DI_TYPES_ALL} from '../../DITypes';
import {IWebDriver} from './contracts/IWebDriver';

@injectable()
export class WebDriver implements IWebDriver {
    constructor(@inject(DI_TYPES_ALL.WebDriver) private _client: any) {
    }

    public get WebDriver(): any {
        return this._client;
    }

    public getClient() {
        return this._client;
    }

}