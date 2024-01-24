import express from 'express';

import { routesLogger } from '@infra/logger/routesLogger';

import { routes } from './routes';

const app = express();

app.use(routesLogger());

app.use(routes);

export { app };
