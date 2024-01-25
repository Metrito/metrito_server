import express from 'express';

import { httpLogger } from '@infra/logger';

import { routes } from './routes';

const app = express();

app.use(httpLogger);

app.use(routes);

export { app };
