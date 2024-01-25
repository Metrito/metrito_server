import 'winston-mongodb';

import moment from 'moment';
import { format, transports } from 'winston';

import utils from '@shared/utils';

import loggerConfig from '../config';

import type { MongoDBTransportInstance } from 'winston-mongodb';

/**
 * Format for logging to the database.
 */
const databaseFormat = format.combine(
  /**
   * Display the timestamp (date and time) when the log was added.
   */
  format.timestamp(),

  /**
   * Extract the value of the '_logs_context' field from within the metadata and
   * create a new field called 'context' outside of the metadata. Finally, remove
   * the '_logs_context' field from the metadata.
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
   * Metadata is a field provided in the log functions.
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

type Transport = transports.FileTransportInstance | MongoDBTransportInstance;

const databaseTransports: Transport[] = [];

if (loggerConfig.DATABASE_STORE_ACTIVITY_LOGS) {
  databaseTransports.push(
    new transports.MongoDB({
      options: { useUnifiedTopology: true },
      db: loggerConfig.DATABASE_URL,
      collection: loggerConfig.ACTIVITY_LOGS_COLLECTION,
      format: databaseFormat,
    }),
  );
}

if (loggerConfig.DATABASE_STORE_ERROR_LOGS) {
  databaseTransports.push(
    new transports.MongoDB({
      options: { useUnifiedTopology: true },
      db: loggerConfig.DATABASE_URL,
      collection: loggerConfig.ERROR_LOGS_COLLECTION,
      format: databaseFormat,
      level: 'error',
    }),
  );
}

export { databaseTransports };
