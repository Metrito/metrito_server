import { Chalk } from 'chalk';
import { clone } from 'lodash';
import winston, { createLogger } from 'winston';

import addTransports from './addTransports';
import loggerConfig from './config';
import { consoleTransports } from './transports/consoleTransports';
import { fileTransports } from './transports/fileTransports';

const loggerMainInstance = createLogger({
  level: loggerConfig.SHOW_DEBUG_LEVEL ? 'debug' : 'info',
});

addTransports(loggerMainInstance, consoleTransports);
addTransports(loggerMainInstance, fileTransports);

type Logger = winston.Logger & {
  context: (context: string, color?: Chalk) => winston.Logger;
};

const logger = clone(loggerMainInstance) as Logger;

logger.context = (context, color) => {
  const contextColored = color ? color(context) : context;

  return logger.child({ _logs_context: contextColored });
};

export { logger as mainLogger };
