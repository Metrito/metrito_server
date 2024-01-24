import 'winston-mongodb';

import expressWinston from 'express-winston';
import { transports, format } from 'winston';

const ERROR_LOGS_FILENAME = 'logs/errors.log';
const ERROR_LOGS_COLLECTION = 'logs_errors';

/**
 * Os transports são onde os logs serão salvos ou exibidos.
 *
 * Em modo de desenvolvimento, os logs de erros ficam salvos no arquivo
 * logs/errors.log.
 *
 * Já em produção, os logs são salvos no Banco de Dados.
 */
function getTransports() {
  if (process.env.NODE_ENV === 'development') {
    return [
      new transports.File({
        level: 'error',
        filename: ERROR_LOGS_FILENAME,
      }),
    ];
  }

  return [
    new transports.MongoDB({
      db: process.env.DATABASE_URL,
      level: 'error',
      collection: ERROR_LOGS_COLLECTION,
    }),
  ];
}

export const logger = () =>
  expressWinston.logger({
    transports: getTransports(),
    format: format.combine(
      format.json(),
      format.timestamp(),
      format.metadata(),
      format.prettyPrint(),
    ),
    statusLevels: true,
    meta: true,
    expressFormat: true,
  });
