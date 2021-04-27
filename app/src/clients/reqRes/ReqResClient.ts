import {IRawUser, IReqGetUsers, IReqResClient, IResGetUsers, IUser} from './contracts/IReqResClient';
import {inject, injectable} from 'inversify';
import {DI_TYPES_ALL} from '../../DITypes';
import {IHttpClient, IRequestConfig, IResponse} from '../../components/httpClient/contracts/IHttpClient';

@injectable()
export class ReqResClient implements IReqResClient {
    public apiUrl = 'https://reqres.in/api';

    constructor(@inject(DI_TYPES_ALL.HttpClient) private _httpClient: IHttpClient) {
    }

    private async getUsersPerPage(page: number): Promise<IResGetUsers> {
        const config: IRequestConfig = {
            method: 'get',
            url: `${this.apiUrl}/users`,
            timeout: 1000,
            params: {page},
            responseType: 'json'
        };
        let response: IResponse;
        try {
            response = await this._httpClient.makeRequest(config);
        } catch (error) {
            console.error(error);
            throw Error('Error while fetching data');
        }

        return response?.data;
    }

    private normalizeUserProps(data: IRawUser): IUser {
        return {
            id: data.id,
            email: data.email,
            firstName: data.first_name,
            lastName: data.last_name,
            avatar: data.avatar
        };
    }

    private normalizeUsersProps(data: Array<IRawUser>): Array<IUser> {
        if (!data.length) {
            return [];
        }

        return data.map((row: IRawUser) => {
            return this.normalizeUserProps(row);
        });
    }

    public async getUsers(req: IReqGetUsers): Promise<Array<IUser>> {
        if (req.allPages) {
            const firstPageData = await this.getUsersPerPage(1);
            const totalPages = firstPageData?.total_pages;
            let restUsersData: Array<IResGetUsers> = [];
            const result: Array<IUser> = [...this.normalizeUsersProps(firstPageData.data)];
            if (totalPages > 1) {
                const requests = [];
                for (let i = 2; i <= totalPages; i++) {
                    requests.push(this.getUsersPerPage(i));
                }
                restUsersData = await Promise.all(requests);
                restUsersData.forEach((arrRes) => {
                    result.push(...this.normalizeUsersProps(arrRes.data));
                });
            }
            return result;
        } else if (req.page) {
              const userData = await this.getUsersPerPage(req.page);
              return [...this.normalizeUsersProps(userData.data)];
        }

        return [];
    }
}