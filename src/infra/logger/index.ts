import 'winston-mongodb';

import chalk, { Chalk } from 'chalk';
import moment from 'moment';
import { createLogger, format, transports } from 'winston';

const openBracket = chalk.gray('[');
const closeBracket = chalk.gray(']');

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

/**
 * O timestamp já é exibido pelo serviço de deploy
 */
const showTimestamp = process.env.NODE_ENV !== 'production';

/**
 * Em produção não é exibido logs do nível debug
 */
const showDebugLevel = process.env.NODE_ENV !== 'production';

const buildLogger = (context: string, color?: Chalk) =>
  createLogger({
    transports: [
      ...getTransports(),

      new transports.Console({
        level: showDebugLevel ? 'debug' : 'info',
        format: format.combine(
          /**
           * Transforma o nível em upper case. No console ficará:
           * ao invés de "info", ficará "INFO".
           * etc...
           */
          format((info) => {
            info.level = info.level.toUpperCase();

            return info;
          })(),

          /**
           * Aplica colorização para cada nível
           */
          format.colorize(),

          /**
           * Formata os logs em um formato legível.
           * [YYYY-MM-DD HH:mm:ss]
           *
           * Em produção, o timestamp não é exibido, pois já é exibido
           * pelo terminal do serviço de deploy.
           */
          format.printf(({ level, message }) => {
            let template = '{{timestamp}} {{level}}: {{message}}';

            if (showTimestamp) {
              const timestamp = moment().format('YYYY-MM-DD HH:mm:ss');

              template = template.replace(
                '{{timestamp}}',
                `${openBracket}${chalk.gray(timestamp)}${closeBracket}`,
              );
            } else {
              template = template.replace('{{timestamp}} ', '');
            }

            template = template.replace(
              '{{level}}',
              `${openBracket}${color?.(context) || context} ${chalk.gray('/')} ${level}${closeBracket}`,
            );
            template = template.replace('{{message}}', message);

            return template;
          }),
        ),
      }),
    ],
  });

export function startLog(context: string, color?: Chalk) {
  return buildLogger(context, color);
}

const defaultLogger = buildLogger('METRITO-SERVER');

export { defaultLogger as logger };
