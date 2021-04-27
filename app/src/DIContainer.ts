import {interfaces, Container} from 'inversify';
import 'reflect-metadata';
import {DI_TYPES_ALL} from './DITypes';
import {IDataFetcherService} from './services/contracts/IDataFetcherService';
import {DataFetcherService} from './services/DataFetcherService';
import {IHttpClient} from './components/httpClient/contracts/IHttpClient';
import axios from 'axios';
import {HttpClient} from './components/httpClient/HttpClient';
import {IDbProvider} from './components/dbProvider/contracts/IDbProvider';
import {KnexDbProvider} from './components/dbProvider/KnexDbProvider';
import {IDbProviderConfig} from './components/dbProvider/contracts/IDbProviderConfig';
import {PostgresDbReqResUserRepository} from './domains/repositories/reqResUser/PostgresDbReqResUserRepository';
import {IReqResUserRepository} from './domains/repositories/reqResUser/contracts/IReqResUserRepository';
import {IReqResClient} from './clients/reqRes/contracts/IReqResClient';
import {ReqResClient} from './clients/reqRes/ReqResClient';
import {IRoute} from './api/v1/routes/contracts/IRoute';
import {DataFetcherRoute} from './api/v1/routes/DataFetcherRoute';
import {IWebDriver} from './components/webDriver/contracts/IWebDriver';
import {WebDriver} from './components/webDriver/WebDriver';
import * as puppeteer from 'puppeteer';
import {IAffluClient} from './clients/afflu/contracts/IAffluClient';
import {AffluClient} from './clients/afflu/AffluClient';
import {IAffluDateRepository} from './domains/repositories/affluDate/contracts/IAffluDateRepository';
import {PostgresDbAffluDateRepository} from './domains/repositories/affluDate/PostgresDbAffluDateRepository';

const container: interfaces.Container = new Container();

container.bind<IDataFetcherService>(DI_TYPES_ALL.DataFetcherService)
    .to(DataFetcherService)
    .inSingletonScope();

container.bind<IHttpClient>(DI_TYPES_ALL.HttpClient)
    .toDynamicValue(() => {
        return new HttpClient(axios);
    })
    .inSingletonScope();

container.bind<IWebDriver>(DI_TYPES_ALL.WebDriver)
    .toDynamicValue(() => {
        return new WebDriver(puppeteer);
    })
    .inSingletonScope();

container.bind<IReqResUserRepository>(DI_TYPES_ALL.PostgresDbReqResUserRepository)
    .to(PostgresDbReqResUserRepository)
    .inSingletonScope();

container.bind<IReqResClient>(DI_TYPES_ALL.ReqResClient)
    .to(ReqResClient)
    .inSingletonScope();

container.bind<IRoute>(DI_TYPES_ALL.DataFetcherRoute)
    .to(DataFetcherRoute)
    .inSingletonScope();

container.bind<IDbProvider>(DI_TYPES_ALL.DbProvider)
    .toDynamicValue(() => {
        const KNEX_SCHEMA = process.env.KNEX_SCHEMA || 'public';
        const KNEX_CONNECTION = process.env.KNEX_CONNECTION;
        const options: IDbProviderConfig = {
            client: 'pg',
            connection: KNEX_CONNECTION,
            searchPath: [KNEX_SCHEMA],
            migrations: {
                extension: 'ts',
                tableName: 'knex_migrations',
                schemaName: KNEX_SCHEMA,
                directory: './src/db/migrations',
            }
        };

        const dbProvider = new KnexDbProvider(options);
        dbProvider.init();
        return dbProvider;
    })
    .inSingletonScope();

container.bind<IAffluClient>(DI_TYPES_ALL.AffluClient)
    .toDynamicValue(() => {
        const AFFLU_LOGIN_URL = process.env.AFFLU_LOGIN_URL || '';
        const AFFLU_USER = process.env.AFFLU_USER || '';
        const AFFLU_PASSWORD = process.env.AFFLU_PASSWORD || '';

        return  new AffluClient(AFFLU_LOGIN_URL, AFFLU_USER, AFFLU_PASSWORD);
    })
    .inSingletonScope();

container.bind<IAffluDateRepository>(DI_TYPES_ALL.PostgresDbAffluDateRepository)
    .to(PostgresDbAffluDateRepository)
    .inSingletonScope();

export {container};