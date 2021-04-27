import {ReqResUser} from '../../../entities/ReqResUser';

export interface IReqResUserRepository {
    // saveUsers(data: Array<ReqResUser>, updateExisting: boolean): Promise<boolean>;
    saveUser(data: ReqResUser, updateExisting: boolean): Promise<boolean>;
}