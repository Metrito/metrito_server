import 'winston-mongodb';

import moment from 'moment';
import { format, transports } from 'winston';

import utils from '@shared/utils';

import loggerConfig from '../config';

import type { MongoDBTransportInstance } from 'winston-mongodb';

const databaseHttpFormat = format.combine(
  /**
   * Exibe o timestamp (data e tempo) que o log foi adicionado.
   */
  format.timestamp(),

  /**
   * Injeta o caminho em que o log foi acionado.
   * Corrige o UTC do timestamp.
   */
  format((info) => {
    const path = utils.currentPath();
    info.path = path || null;

    if (info.timestamp) {
      info.timestamp = moment(info.timestamp).utc(true).format();
    }

    return info;
  })(),

  /**
   * Injeta o campo metadata gerados pelas requisições e respostas.
   */
  format.metadata({
    fillExcept: ['message', 'level', 'timestamp', 'path'],
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

const databaseHttpTransports: Transport[] = [];

if (loggerConfig.DATABASE_STORE_HTTP_ERROR_LOGS) {
  databaseHttpTransports.push(
    new transports.MongoDB({
      options: { useUnifiedTopology: true },
      db: loggerConfig.DATABASE_URL,
      collection: loggerConfig.HTTP_ERROR_LOGS_COLLECTION,
      format: databaseHttpFormat,
      level: loggerConfig.INCLUDES_400_ERRORS ? 'warn' : 'error',
    }),
  );
}

export { databaseHttpTransports };
