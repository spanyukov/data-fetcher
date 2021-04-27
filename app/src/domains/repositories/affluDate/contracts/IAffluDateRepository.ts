import {AffluDate} from '../../../entities/AffluDate';

export interface IAffluDateRepository {
    // saveDatesRows(data: Array<AffluDate>, updateExisting: boolean): Promise<boolean>;
    saveDateRow(data: AffluDate, updateExisting: boolean): Promise<boolean>;
}