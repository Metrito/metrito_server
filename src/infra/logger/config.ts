import path from 'node:path';

const LOGS_DIR = 'logs';

const loggerConfig = {
  /**
   * Set to true to display debug logs.
   *
   * It is not a good practice to display debug logs in production.
   */
  SHOW_DEBUG_LEVEL: process.env.NODE_ENV !== 'production',

  /**
   * Set to true to store activity logs in the 'logs/activities' directory.
   */
  STORE_ACTIVITY_LOGS: true,

  /**
   * Set to true to store error logs in the 'logs/errors' directory.
   */
  STORE_ERROR_LOGS: true,

  /**
   * Set to true to store HTTP request error logs in the 'logs/http_errors'
   * directory.
   */
  STORE_HTTP_ERROR_LOGS: true,

  /**
   * Set to true to store activity logs in the database.
   */
  DATABASE_STORE_ACTIVITY_LOGS: true,

  /**
   * Set to true to store error logs in the database.
   */
  DATABASE_STORE_ERROR_LOGS: true,

  /**
   * Set to true to store HTTP request error logs in the database.
   */
  DATABASE_STORE_HTTP_ERROR_LOGS: true,

  /**
   * Set to true to store 400 errors in the log files.
   */
  INCLUDES_400_ERRORS: true,

  /**
   * Set to true to store 400 errors in the database.
   */
  DATABASE_INCLUDES_400_ERRORS: true,

  /**
   * Directory where logs will be saved locally.
   */
  LOGS_DIR,

  /**
   * Directory where activity logs will be saved.
   */
  ACTIVITY_LOGS_DIR: path.resolve(LOGS_DIR, 'activities'),

  /**
   * Directory where error logs will be saved.
   */
  ERROR_LOGS_DIR: path.resolve(LOGS_DIR, 'errors'),

  /**
   * Directory where HTTP request error logs will be saved.
   */
  HTTP_ERROR_LOGS_DIR: path.resolve(LOGS_DIR, 'http_errors'),

  /**
   * URL of the database where logs will be stored.
   */
  DATABASE_URL: process.env.DATABASE_URL,

  /**
   * Collection in the database where activity logs will be stored.
   */
  ACTIVITY_LOGS_COLLECTION: 'logs_activities',

  /**
   * Collection in the database where error logs will be stored.
   */
  ERROR_LOGS_COLLECTION: 'logs_errors',

  /**
   * Collection in the database where HTTP request error logs will be stored.
   */
  HTTP_ERROR_LOGS_COLLECTION: 'logs_http_errors',

  /**
   * Maximum size per log file.
   */
  MAX_SIZE_PER_FILE: 250 * 1024 * 1024, // 250mb

  /**
   * Log file extension.
   */
  LOGS_FILE_EXTENSION: '.log',

  /**
   * If true, log files will always be zipped for compression.
   */
  LOGS_FILE_ZIPPED: false,
};

export default loggerConfig;
