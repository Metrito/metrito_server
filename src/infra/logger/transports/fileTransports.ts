import path from 'node:path';

import moment from 'moment';
import { format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

import utils from '@shared/utils';

import loggerConfig from '../config';

/**
 * Format for logging information to files.
 */
const fileFormat = format.combine(
  /**
   * Display the timestamp (date and time) when the log was added.
   */
  format.timestamp(),

  /**
   * Extract the value of the '_logs_context' field from the meta and create a new
   * field called 'context' outside of meta. Finally, remove the '_logs_context'
   * field from meta.
   * Inject the path where the log was triggered.
   * Remove ANSI colors from the message.
   * Correct the UTC of the timestamp.
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
   * Inject the metadata field.
   * Metadata is a field provided in log functions.
   * Example: `logger.info('Hello', { thisIsMetadata: true })`
   */
  format.metadata({
    fillExcept: ['message', 'level', 'timestamp', 'context', 'path'],
  }),

  /**
   * Format the log as JSON.
   */
  format.json(),

  /**
   * Make the JSON readable.
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
