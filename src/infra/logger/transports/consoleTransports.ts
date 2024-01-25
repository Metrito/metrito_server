import chalk from 'chalk';
import moment from 'moment';
import { format, transports } from 'winston';

import objectUtils from '@shared/objectUtils';
import utils from '@shared/utils';

/**
 * Hack to capture the "info" typing from the format.printf callback function.
 */
type PrintfFunction = typeof format.printf;
type PrintfCallback = Parameters<PrintfFunction>[0];
type PrintfCallbackParams = Parameters<PrintfCallback>;
type TransformableInfo = PrintfCallbackParams[0];

/**
 * Console log template.
 *
 * Available tags:
 * {{timestamp}} - Log timestamp
 * {{path}} - File path where the log was executed
 * {{context}} - Log context
 * {{level}} - Log level
 * {{message}} - Log message
 *
 * Any brackets, colons, or slashes with a $ at the end will be grayed out.
 */
const LOG_TEMPLATE =
  '$[{{timestamp}}$] $[{{context}} $/ {{level}}$]$: {{message}} {{path}}';

/**
 * Flag to display [YYYY-MM-DD HH:mm:ss] in logs.
 *
 * The timestamp is already displayed by the deploy service.
 */
const SHOW_TIMESTAMP = process.env.NODE_ENV !== 'production';

/**
 * Flag to display the file directory responsible for the log.
 */
const SHOW_PATH = process.env.NODE_ENV !== 'production';

/**
 * Replace the timestamp tag in the template. If the SHOW_TIMESTAMP flag
 * is false, the timestamp is displayed as empty.
 */
function replaceTimestamp(template: string) {
  if (SHOW_TIMESTAMP) {
    const timestamp = moment().format('YYYY-MM-DD HH:mm:ss');

    template = template.replace('{{timestamp}}', chalk.gray(timestamp));
  } else {
    template = template.replace('{{timestamp}} ', '');
  }

  return template;
}

/**
 * Replace the level tag in the template.
 */
function replaceLevel(template: string, info: TransformableInfo) {
  return template.replace('{{level}}', chalk.bold(info.level));
}

/**
 * Replace the path tag in the template.
 */
function replacePath(template: string) {
  const path = utils.currentPath();

  if (path) {
    const color = chalk.italic.hex('#8a7c9c');

    return template.replace('{{path}}', color(path));
  }

  return template.replace('{{path}}', '');
}

/**
 * Replace the context tag in the template.
 *
 * Fields in the metadata that start with "_logs_" are injected by the code
 * for log organization and are not displayed in the final logs.
 */
function replaceContext(template: string, info: TransformableInfo) {
  const context = info.metadata?._logs_context;

  if (context) {
    delete info.metadata._logs_context;

    return template.replace('{{context}}', chalk.bold(context));
  }

  return template;
}

/**
 * Replace the message tag in the template.
 */
function replaceMessage(template: string, info: TransformableInfo) {
  /**
   * A complex cleanup is performed to display the final message.
   *
   * In addition to the "message" field, it is also possible to provide various other
   * messages and even metadata.
   *
   * When sending a simple log `logger.info('Hello World')`, 'Hello World'
   * is the simple `info.message` property.
   *
   * When sending a log with metadata `logger.info('Hello', { ok: true })`,
   * 'Hello' is the simple `info.message` property and { ok: true } is the
   * info.metadata property.
   *
   * When sending a sequence of messages `logger.info('Hello', 'World')`,
   * 'Hello' is the simple `info.message` property and 'World' is the
   * info[Symbol.for('splat')] property. In these cases, the remaining messages
   * will be displayed as an array of strings.
   *
   * There are also cases of sending an object in some random parameter, it ending
   * up coming from within the Symbol('splat') field, and so on.
   *
   * The complexity below cleans up the message, metadata, and Symbol('splat') fields,
   * to faithfully display the final message.
   */

  let finalMessage: string = '';

  if (typeof info.message === 'string') {
    finalMessage = info.message;
  } else if (typeof info.message === 'object') {
    finalMessage = objectUtils.inspect(info.message);
  }

  if (typeof info.metadata === 'object') {
    finalMessage += ` ${objectUtils.inspect(info.metadata)}`;
  }

  const splat = info[Symbol.for('splat')];

  if (typeof splat === 'string') {
    finalMessage += ` ${splat}`;
  } else if (Array.isArray(splat)) {
    const hasMetadata = !!info.metadata;

    /**
     * The splat also adds metadata to its composition.
     */
    if (hasMetadata) {
      splat.splice(0, 1);
    }

    const splatMessage = splat
      .map((splatValue) =>
        typeof splatValue === 'object'
          ? objectUtils.inspect(splatValue)
          : splatValue,
      )
      .join(' ');

    finalMessage += ` ${splatMessage}`;
  }

  finalMessage = finalMessage.trim();

  return template.replace('{{message}}', `${finalMessage}`);
}

/**
 * Clean up and remove any remaining values or brackets with no internal values.
 *
 * Examples:
 * - Before: [] [{{label}} / ERROR]: Wrong value
 * - After: [ERROR]: Wrong value
 *
 * - Before: [2024-01-24 13:25:27] [METRITO / INFO]: Starting
 * - After: [2024-01-24 13:25:27] [METRITO / INFO]: Starting (nothing changes, as no value is missing)
 */
function cleanMessage(message: string) {
  return message
    .replace(/{{.+?}}/g, '') // remove tags: '{{something}}' -> ''
    .replace(/\$\[\$\]/g, '') // remove empty brackets: '[]' -> ''
    .replace(/undefined/g, '') // remove undefined values
    .replace(/\[ \$\/ /g, '[') // remove unnecessary slash: '[ / INFO]' -> '[INFO]'
    .trim();
}

/**
 * Apply gray color to special characters in the template.
 */
function applyGrayForCharacters(message: string) {
  return message
    .replace(/\$:/g, chalk.gray(':'))
    .replace(/\$\//g, chalk.gray('/'))
    .replace(/\$\[/g, chalk.gray('['))
    .replace(/\$\]/g, chalk.gray(']'));
}

const consoleFormat = format.combine(
  /**
   * Convert the level to uppercase. In the console it will be:
   * instead of "info", it will be "INFO".
   * etc...
   */
  format((info) => {
    info.level = info.level.toUpperCase();

    return info;
  })(),

  /**
   * Inject the metadata field into the printf info field.
   * Metadata is a field provided in the log functions.
   * Example: `logger.info('Hello', { thisIsMetadata: true })`
   */
  format.metadata(),

  /**
   * Apply colorization for each level.
   */
  format.colorize(),

  /**
   * Format the final log in the LOG_TEMPLATE format.
   */
  format.printf((info) => {
    /**
     * Recreate a copy of the template to start replacing the {{}} tags with
     * actual values.
     */
    let template = LOG_TEMPLATE;

    if (SHOW_PATH) {
      template = replacePath(template);
    }

    template = replaceTimestamp(template);
    template = replaceLevel(template, info);
    template = replaceContext(template, info);

    /**
     * If the metadata is empty, delete it to avoid displaying it in the logs.
     */
    if (objectUtils.isEmpty(info.metadata)) {
      delete info.metadata;
    }

    template = replaceMessage(template, info);
    const finalMessage = cleanMessage(template);

    return applyGrayForCharacters(finalMessage);
  }),
);

const consoleTransports = [
  new transports.Console({
    format: consoleFormat,
  }),
];

export { consoleTransports };
