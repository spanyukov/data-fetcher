
export interface IDatesRow {
    date: Date;
    commission: number;
    sales: number;
    leads: number;
    clicks: number;
    epc: number;
    impressions: number;
    cr: number;
}

export interface IAffluClient {
    fetchDatesRows(startDate: Date, endDate: Date): Promise<Array<IDatesRow>>;
}