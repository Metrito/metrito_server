import { app } from './app';
import { listen } from './appListenFunction';

const port = process.env.PORT;

/**
 * Server initialization.
 *
 * When starting the server, tests are carried out on vital resources that are
 * essential for the complete functioning of the server.
 */
async function main() {
  console.info('Starting server...');

  await listen(app, port);

  console.info(`Server is running on port ${port}`);
}

main();
