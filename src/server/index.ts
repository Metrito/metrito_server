import chalk from 'chalk';

import { mainLogger } from '@infra/logger';

import { app } from './app';
import { listen } from './appListenFunction';

const logger = mainLogger.context('SERVER', chalk.cyan);

const port = process.env.PORT;

/**
 * Server initialization.
 *
 * When starting the server, tests are carried out on vital resources that are
 * essential for the complete functioning of the server.
 */
async function main() {
  logger.info('Starting server...');

  await listen(app, port);

  logger.info(`Server is running on port ${chalk.yellow(port)}`);
}

main();
