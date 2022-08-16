import { init } from './init/init';
init(); // Executed synchronously before the rest of your app loads

import * as functions from 'firebase-functions';
import { endpoints } from './app';

export const endpoints_01 = functions.runWith({
  timeoutSeconds: 2 * 60,
}).https.onRequest(endpoints);
