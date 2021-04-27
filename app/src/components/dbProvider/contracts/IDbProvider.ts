
export interface IDbProvider {
    connection?: any;
    init(): Promise<void>;
    isInitialized(): boolean;
    destroy(): Promise<void>;
}