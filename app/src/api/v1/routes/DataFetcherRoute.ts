import {inject, injectable} from 'inversify';
import {IRoute} from './contracts/IRoute';
import {DI_TYPES_ALL} from '../../../DITypes';
import {IDataFetcherService} from '../../../services/contracts/IDataFetcherService';

@injectable()
export class DataFetcherRoute implements IRoute {
    static readonly baseRoute = '/data-fetcher';
    constructor(
        @inject(DI_TYPES_ALL.DataFetcherService) private dataFetcherService: IDataFetcherService
    ) {
    }

    public init(app: any) {
        app.get(`${DataFetcherRoute.baseRoute}/users`, async (req: any, res: any) => {
            console.log(req.query);
            let success;
            let code;
            try {
                success = await this.dataFetcherService.fetchUsers();
                code = 200;
            } catch (e) {
                console.log('Internal error');
                code = 500;
                success = false;
            }

            res.status(code).json({status: success});
        });

        app.get(`${DataFetcherRoute.baseRoute}/dates`, async (req: any, res: any) => {
            console.log(req.query);
            let success;
            let code;
            try {
                const startDate = new Date('2020-10-01');
                const endDate = new Date('2020-10-30');
                success = await this.dataFetcherService.fetchDates(startDate, endDate);
                code = 200;
            } catch (e) {
                console.log('Internal error');
                code = 500;
                success = false;
            }
            res.status(code).json({status: success});
        });
    }

}