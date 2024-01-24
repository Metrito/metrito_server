import express from 'express';

import { routes } from './routes';
import { logger } from './settings/logger';

const app = express();

app.use(logger());

app.use(routes);

export { app };
