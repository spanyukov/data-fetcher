import {injectable} from 'inversify';
import Knex from 'knex';
import {IDbProvider} from './contracts/IDbProvider';
import {IDbProviderConfig} from './contracts/IDbProviderConfig';

@injectable()
export class KnexDbProvider implements IDbProvider {
    public connection?: Knex;

    constructor(
        private config: IDbProviderConfig
    ) {
    }

    async init(): Promise<void> {
        this.connection = await Knex(this.config);
    }

    isInitialized(): boolean {
        return !!this.connection;
    }

    async destroy(): Promise<void> {
        if (this.connection) {
            await this.connection.destroy();
        }
    }

    public table(table: string, alias?: string) {
        if (!this.connection) {
            throw new Error('Connection not initialized');
        }

        return this.connection(alias ? `${table} as ${alias}` : table);
    }

}