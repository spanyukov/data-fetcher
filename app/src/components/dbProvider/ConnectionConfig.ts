import {injectable} from 'inversify';

@injectable()
export class ConnectionConfig<T extends object> {
    private readonly _jsonOptions: T;
    constructor(jsonOptions: T) {
        this._jsonOptions = jsonOptions;
    }

    /**
     * get connection options
     */
    public async getOptions() {
        const options = {};
        Object.assign(options, this._jsonOptions);

        return options;
    }

}