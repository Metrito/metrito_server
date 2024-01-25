import 'winston-mongodb';

import moment from 'moment';
import { format, transports } from 'winston';

import utils from '@shared/utils';

import loggerConfig from '../config';

import type { MongoDBTransportInstance } from 'winston-mongodb';

const databaseFormat = format.combine(
  /**
   * Exibe o timestamp (data e tempo) que o log foi adicionado.
   */
  format.timestamp(),

  /**
   * Pega o valor do campo _logs_context de dentro do meta e cria um novo
   * campo chamado context fora do meta. Por fim, remove o campo _logs_context
   * do meta.
   * Injeta o caminho em que o log foi acionado.
   * Remove cores ANSI da mensagem.
   * Corrige o UTC do timestamp.
   */
  format((info) => {
    if ('_logs_context' in info) {
      const context = info._logs_context;

      info.context = utils.removeANSIColors(context);

      delete info._logs_context;
    }

    const path = utils.currentPath();
    info.path = path || null;

    if (info.message) {
      info.message = utils.removeANSIColors(info.message);
    }

    if (info.timestamp) {
      info.timestamp = moment(info.timestamp).utc(true).format();
    }

    return info;
  })(),

  /**
   * Injeta o campo metadata.
   * Metadata é um campo providenciado nas funções de logs.
   * Exemplo: `logger.info('Hello', { thisIsMetadata: true })`
   */
  format.metadata({
    fillExcept: ['message', 'level', 'timestamp', 'context', 'path'],
  }),

  /**
   * Formata o log como JSON.
   */
  format.json(),

  /**
   * Deixa o JSON legível.
   */
  format.prettyPrint(),
);

type Transport = transports.FileTransportInstance | MongoDBTransportInstance;

const databaseTransports: Transport[] = [];

if (loggerConfig.DATABASE_STORE_ACTIVITY_LOGS) {
  databaseTransports.push(
    new transports.MongoDB({
      db: loggerConfig.DATABASE_URL,
      collection: loggerConfig.ACTIVITY_LOGS_COLLECTION,
      format: databaseFormat,
    }),
  );
}

if (loggerConfig.DATABASE_STORE_ERROR_LOGS) {
  databaseTransports.push(
    new transports.MongoDB({
      db: loggerConfig.DATABASE_URL,
      collection: loggerConfig.ERROR_LOGS_COLLECTION,
      format: databaseFormat,
      level: 'error',
    }),
  );
}

export { databaseTransports };
