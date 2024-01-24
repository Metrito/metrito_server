import express from 'express';

import { routes } from './routes';
import { logger } from './settings/logger';

const app = express();

app.use(logger());

app.get('/400', (req, res) => res.sendStatus(400));

app.get('/500', (req, res) => res.sendStatus(500));

app.get('/fatal', () => {
  throw new Error('WTF');
});

app.use(routes);

export { app };
