import express from 'express';

import { httpLogger } from '@infra/logger';

import { routes } from './routes';

const app = express();

app.use(httpLogger);

app.use('/200', (req, res) => res.sendStatus(200));
app.use('/400', (req, res) => res.sendStatus(400));
app.use('/500', (req, res) => res.sendStatus(500));
app.use('/fatal', () => {
  throw new Error('Fatal Error');
});

app.use(routes);

export { app };
