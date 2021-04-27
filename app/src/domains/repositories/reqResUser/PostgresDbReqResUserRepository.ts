import {IReqResUserRepository} from './contracts/IReqResUserRepository';
import {ReqResUser} from '../../entities/ReqResUser';
import {inject, injectable} from 'inversify';
import {IDbProvider} from '../../../components/dbProvider/contracts/IDbProvider';
import {DI_TYPES_ALL} from '../../../DITypes';

@injectable()
export class PostgresDbReqResUserRepository implements IReqResUserRepository {
    static readonly table = 'public.reqres_users';
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

    public async saveUser(req: ReqResUser, updateExisting: boolean): Promise<boolean> {
        let sql = '';
        if (updateExisting) {
            sql = `insert into ${PostgresDbReqResUserRepository.table}
            (id, email, first_name, last_name, avatar) values (:id, :email, :firstName, :lastName, :avatar)
             ON CONFLICT (id) DO UPDATE
              SET email = EXCLUDED.email, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, avatar = EXCLUDED.avatar;`;
        } else {
            sql = `insert into ${PostgresDbReqResUserRepository.table}
            (id, email, first_name, last_name, avatar) values (:id, :email, :firstName, :lastName, :avatar) ON CONFLICT (id) DO NOTHING;`;
        }
        const queryBuilder = await this.getQueryBuilder();
        console.log(req);
        const query = queryBuilder?.raw(sql, {
            id: req.id,
            email: req.email,
            firstName: req.firstName,
            lastName: req.lastName,
            avatar: req.avatar
        });

        return !! await query;
    }
}