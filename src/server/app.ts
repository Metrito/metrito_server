import express from 'express';

import { routes } from './routes';
import { configureSettings } from './settings';

const app = express();

configureSettings(app);

app.use(routes);

export { app };
