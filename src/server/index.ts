import chalk from 'chalk';

import { mainLogger } from '@infra/logger';

import { app } from './app';
import { listen } from './appListenFunction';

const logger = mainLogger.context('SERVER', chalk.cyan);

const port = process.env.PORT;

/**
 * Server Initialization
 *
 * This script initializes the server, performing essential checks on vital resources
 * to ensure the complete and smooth functioning of the application.
 *
 * The process includes starting the server, performing necessary tests, and logging
 * information about the server status.
 */
async function initializeServer() {
  logger.info('Starting server...');

  await listen(app, port);

  logger.info(`Server is running on port ${chalk.yellow(port)}`);
}

initializeServer().catch((error) => {
  logger.error(chalk.red('Error occurred during server startup:'));
  logger.error(error);

  setTimeout(() => {
    process.exit(1);
  }, 3000); // 3 seconds to save the error in the logs
});
