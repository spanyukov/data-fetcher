
export interface IDataFetcherService {
    fetchUsers(): Promise<boolean>;
    fetchDates(startDate: Date, endDate: Date): Promise<boolean>;
}