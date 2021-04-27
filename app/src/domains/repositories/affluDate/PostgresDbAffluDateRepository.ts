import {inject, injectable} from 'inversify';
import {IDbProvider} from '../../../components/dbProvider/contracts/IDbProvider';
import {DI_TYPES_ALL} from '../../../DITypes';
import {IAffluDateRepository} from './contracts/IAffluDateRepository';
import {AffluDate} from '../../entities/AffluDate';

@injectable()
export class PostgresDbAffluDateRepository implements IAffluDateRepository {
    static readonly table = 'public.afflu_dates';
    constructor(
        @inject(DI_TYPES_ALL.DbProvider) private dbProvider: Promise<IDbProvider>
    ) {
    }

    private async getQueryBuilder() {
            const db = await this.dbProvider;
            if (!db.isInitialized()) {
                throw new Error('Connection not initialized');
            }
            return db?.connection;
    }

    public async saveDateRow(req: AffluDate, updateExisting: boolean): Promise<boolean> {
        let sql = '';
        if (updateExisting) {
            sql = `insert into ${PostgresDbAffluDateRepository.table}
            (date, commission, sales, leads, clicks, epc, impressions, cr, updated_at)
             values (:date, :commission, :sales, :leads, :clicks, :epc, :impressions, :cr, NOW())
             ON CONFLICT (date) DO UPDATE
              SET commission = EXCLUDED.commission, sales = EXCLUDED.sales, leads = EXCLUDED.leads
                , clicks = EXCLUDED.clicks, epc = EXCLUDED.epc, impressions = EXCLUDED.impressions
                , cr = EXCLUDED.cr, updated_at = NOW();`;
        } else {
            sql = `insert into ${PostgresDbAffluDateRepository.table}
            (date, commission, sales, leads, clicks, epc, impressions, cr, updated_at)
             values (:date, :commission, :sales, :leads, :clicks, :epc, :impressions, :cr, NOW())
             ON CONFLICT (date) DO NOTHING;`;
        }

        const queryBuilder = await this.getQueryBuilder();
        const query = queryBuilder?.raw(sql, {
            date: req.date,
            commission: req.commission,
            sales: req.sales,
            leads: req.leads,
            clicks: req.clicks,
            epc: req.epc,
            impressions: req.impressions,
            cr: req.cr
        });
        console.log(req);
        console.log(query.toString());

        return !! await query;
    }
}