import {IDataFetcherService} from './contracts/IDataFetcherService';
import {inject, injectable} from 'inversify';
import {DI_TYPES_ALL} from '../DITypes';
import {IReqResUserRepository} from '../domains/repositories/reqResUser/contracts/IReqResUserRepository';
import {IReqResClient} from '../clients/reqRes/contracts/IReqResClient';
import {IAffluClient} from '../clients/afflu/contracts/IAffluClient';
import {IAffluDateRepository} from '../domains/repositories/affluDate/contracts/IAffluDateRepository';

@injectable()
export class DataFetcherService implements IDataFetcherService {
    constructor(
        @inject(DI_TYPES_ALL.PostgresDbReqResUserRepository) private dbReqResUserRepository: IReqResUserRepository,
        @inject(DI_TYPES_ALL.ReqResClient) private reqResClient: IReqResClient,
        @inject(DI_TYPES_ALL.AffluClient) private affluClient: IAffluClient,
        @inject(DI_TYPES_ALL.PostgresDbAffluDateRepository) private dbAffluDateRepository: IAffluDateRepository,
    ) {
    }

    public async fetchUsers(): Promise<boolean> {
        try {
            const data = await this.reqResClient.getUsers({allPages: true}); // should be chunked. allPages for test
            if (data) {
                const requests: any = [];
                data.forEach(user => {
                    requests.push(this.dbReqResUserRepository.saveUser(user, false));
                });
                return !!await Promise.all(requests);
            }
        } catch (e) {
            console.log(e);
            throw new Error('Internal error');
        }

        return false;
    }

    public async fetchDates(startDate: Date, endDate: Date): Promise<boolean> {
        try {
            const data = await this.affluClient.fetchDatesRows(startDate, endDate);
            if (data) {
                const requests: any = [];
                data.forEach(row => {
                    const affluDateRow = {
                        date: row.date,
                        commission: row.commission,
                        sales: row.sales,
                        leads: row.leads,
                        clicks: row.clicks,
                        epc: row.epc,
                        impressions: row.impressions,
                        cr: row.cr
                    };
                    requests.push(this.dbAffluDateRepository.saveDateRow(affluDateRow, false));
                });
                return !!await Promise.all(requests);
            }
        } catch (e) {
            console.log(e);
            throw new Error('Internal error');
        }

        return false;
    }

}