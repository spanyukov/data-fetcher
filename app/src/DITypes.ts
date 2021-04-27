
const DI_TYPES_ALL = {
    DataFetcherService: Symbol.for('DataFetcherService'),
    HttpClient: Symbol.for('HttpClient'),
    DbProvider: Symbol.for('DbProvider'),
    PostgresDbReqResUserRepository: Symbol.for('PostgresDbReqResUserRepository'),
    ReqResClient: Symbol.for('ReqResClient'),
    DataFetcherRoute: Symbol.for('DataFetcherRoute'),
    WebDriver: Symbol.for('WebDriver'),
    AffluClient: Symbol.for('AffluClient'),
    PostgresDbAffluDateRepository: Symbol.for('PostgresDbAffluDateRepository'),
};

export {DI_TYPES_ALL};