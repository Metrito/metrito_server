import chalk from 'chalk';
import compression from 'compression';
import cors from 'cors';
import express, { Express } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import morgan from 'morgan';

import { httpLogger, mainLogger } from '@infra/logger';

const logger = mainLogger.context('APP', chalk.blue);

/**
 * Configure settings to express app.
 */
export function configureSettings(app: Express) {
  logger.info('Configuring settings...');

  app.use(express.json());

  /**
   * Enable security headers.
   *
   * https://helmetjs.github.io/docs/
   */
  app.use(helmet());

  /**
   * Enable gzip compression.
   *
   * https://www.npmjs.com/package/compression
   */
  app.use(compression());

  /**
   * Allow cross-origin requests.
   *
   * https://www.npmjs.com/package/cors
   */
  app.use(cors());

  /**
   * Block all requests that exceed the rate limit.
   * Actually limit: 150 requests per minute.
   *
   * https://www.npmjs.com/package/express-rate-limit
   */
  app.use(
    rateLimit({
      windowMs: 60 * 1000, // 1 minute
      max: 150, // 150 requests
    }),
  );

  /**
   * Log requests to the console.
   *
   * https://www.npmjs.com/package/morgan
   */
  app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));

  /**
   * Store HTTP requests logs.
   */
  app.use(httpLogger);

  logger.info('Settings configured');
}
