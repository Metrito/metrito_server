/**
 * Tipos de logs:
 * - Activity logs: são todos os logs que acontece na aplicação, sem filtro.
 * - Error logs: são todos os logs de erros que acontecem na aplicação.
 * - HTTP Error logs: são todos os logs de erros gerados automaticamente
 *   por alguma requisição HTTP que foi finalizada com status de erro (500~599)
 *
 * Os logs "activity" e "error" são da instância padrão do winston, onde
 * é retornada pelo buildLogger.
 *
 * Já os logs de "HTTP error" são da instância do expressWinston, onde é
 * retornada pelo buildExpressLogger.
 */

import { Chalk } from 'chalk';
import expressWinston from 'express-winston';
import { clone } from 'lodash';
import winston, { createLogger } from 'winston';

import addTransports from './addTransports';
import loggerConfig from './config';
import { consoleTransports } from './transports/consoleTransports';
import { databaseHttpTransports } from './transports/databaseHttpTransports';
import { databaseTransports } from './transports/databaseTransports';
import { fileHttpTransports } from './transports/fileHttpTransports';
import { fileTransports } from './transports/fileTransports';

/**
 * Retorna a instância do logger padrão do winston.
 * Esse logger é utilizado para exibir informações, erros e outros ao decorrer
 * da aplicação.
 */
function buildLogger() {
  const loggerMainInstance = createLogger({
    level: loggerConfig.SHOW_DEBUG_LEVEL ? 'debug' : 'info',
  });

  addTransports(loggerMainInstance, consoleTransports);
  addTransports(loggerMainInstance, fileTransports);
  addTransports(loggerMainInstance, databaseTransports);

  type Logger = winston.Logger & {
    context: (context: string, color?: Chalk) => winston.Logger;
  };

  const logger = clone(loggerMainInstance) as Logger;

  logger.context = (context, color) => {
    const contextColored = color ? color(context) : context;

    return logger.child({ _logs_context: contextColored });
  };

  return logger;
}

/**
 * Retorna um middleware de logger do expressWinston.
 * Esse tipo de logger é gerado automaticamente quando alguma requisição retorna
 * algum status de erro (500~599).
 */
function buildExpressLogger() {
  const loggerMiddleware = expressWinston.logger({
    transports: [...fileHttpTransports, ...databaseHttpTransports],
    statusLevels: true,
    meta: true,
    expressFormat: true,
  });

  return loggerMiddleware;
}

const mainLogger = buildLogger();
const httpLogger = buildExpressLogger();

export { mainLogger, httpLogger };
