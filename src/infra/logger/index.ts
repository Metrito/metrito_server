/**
 * Tipos de logs:
 * - Activity logs: são todos os logs que acontece na aplicação, sem filtro.
 * - Error logs: são todos os logs de erros que acontecem na aplicação.
 * - HTTP Error logs: são todos os logs de erros gerados automaticamente
 *   por alguma requisição HTTP que foi finalizada com status de erro (400~599)
 */

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
