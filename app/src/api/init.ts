import express from 'express';
import {IRoute} from './v1/routes/contracts/IRoute';
import {DI_TYPES_ALL} from '../DITypes';
import {container} from '../DIContainer';

const app = express();

const startExpressApp = () => {
    const port = process.env.API_PORT || 3001;
    app.listen(port, () => {
        console.log(`The app listening at http://localhost:${port}`);
    });
};

const apiInit = () => {
    startExpressApp();
    const datafetcherRoute = container.get<IRoute>(DI_TYPES_ALL.DataFetcherRoute);
    datafetcherRoute.init(app);
};

export {apiInit, app};