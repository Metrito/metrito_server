import path from 'node:path';

import moment from 'moment';
import { format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

import utils from '@shared/utils';

import loggerConfig from '../config';

const fileHttpFormat = format.combine(
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

type Transport = transports.FileTransportInstance | DailyRotateFile;

const fileHttpTransports: Transport[] = [];

if (loggerConfig.STORE_HTTP_ERROR_LOGS) {
  fileHttpTransports.push(
    new DailyRotateFile({
      filename: path.resolve(
        loggerConfig.HTTP_ERROR_LOGS_DIR,
        'http_errors-%DATE%',
      ),
      extension: loggerConfig.LOGS_FILE_EXTENSION,
      format: fileHttpFormat,
      maxSize: loggerConfig.MAX_SIZE_PER_FILE,
      zippedArchive: loggerConfig.LOGS_FILE_ZIPPED,
      level: loggerConfig.INCLUDES_400_ERRORS ? 'warn' : 'error',
    }),
  );
}

export { fileHttpTransports };
