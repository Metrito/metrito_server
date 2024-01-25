import path from 'node:path';

import moment from 'moment';
import { format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

import utils from '@shared/utils';

import loggerConfig from '../config';

const fileFormat = format.combine(
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

type Transport = transports.FileTransportInstance | DailyRotateFile;

const fileTransports: Transport[] = [];

if (loggerConfig.STORE_ACTIVITY_LOGS) {
  fileTransports.push(
    new DailyRotateFile({
      filename: path.resolve(loggerConfig.ACTIVITY_LOGS_DIR, 'activity-%DATE%'),
      extension: loggerConfig.LOGS_FILE_EXTENSION,
      format: fileFormat,
      maxSize: loggerConfig.MAX_SIZE_PER_FILE,
      zippedArchive: loggerConfig.LOGS_FILE_ZIPPED,
    }),
  );
}

if (loggerConfig.STORE_ERROR_LOGS) {
  fileTransports.push(
    new DailyRotateFile({
      filename: path.resolve(loggerConfig.ERROR_LOGS_DIR, 'errors-%DATE%'),
      extension: loggerConfig.LOGS_FILE_EXTENSION,
      format: fileFormat,
      maxSize: loggerConfig.MAX_SIZE_PER_FILE,
      zippedArchive: loggerConfig.LOGS_FILE_ZIPPED,
      level: 'error',
    }),
  );
}

export { fileTransports };
