import * as dotenv from 'dotenv';
import {apiInit} from './api/init';
import {container} from './DIContainer';

console.log('The app is initializaing...');

dotenv.config();
console.log(container);
apiInit();