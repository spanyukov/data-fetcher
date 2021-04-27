export interface IReqGetUsers {
    page?: number;
    id?: number;
    allPages?: boolean;
}

export interface IResGetUsers {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
    data: Array<IRawUser>;
}

export interface IUser {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    avatar: string;
}

export interface IRawUser {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    avatar: string;
}

export interface IReqResClient {
    getUsers(params: IReqGetUsers): Promise<Array<IUser>>;
}