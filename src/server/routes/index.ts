import { Router } from 'express';

import makeCheckServerHealthController from '@factories/makeCheckServerHealthController';
import routeAdapter from '@server/adapters/routeAdapter';

const routes = Router();

routes.get('/', routeAdapter(makeCheckServerHealthController()));

export { routes };
