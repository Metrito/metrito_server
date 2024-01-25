import chalk from 'chalk';
import moment from 'moment';
import { format, transports } from 'winston';

import objectUtils from '@shared/objectUtils';
import utils from '@shared/utils';

/**
 * Hack para pegar a tipagem de "info" do callback da função format.printf
 */
type PrintfFunction = typeof format.printf;
type PrintfCallback = Parameters<PrintfFunction>[0];
type PrintfCallbackParams = Parameters<PrintfCallback>;
type TransformableInfo = PrintfCallbackParams[0];

/**
 * Template do log para console
 *
 * Tags existentes:
 * {{timestamp}} - Horário do log
 * {{path}} - Caminho do arquivo que executou o log
 * {{context}} - Contexto do log
 * {{level}} - Nível do log
 * {{message}} - Mensagem
 *
 * Todos os colchetes, dois pontos ou barra que possuem $ atrás serão colorizados de cinza
 */
const LOG_TEMPLATE =
  '$[{{timestamp}}$] $[{{context}} $/ {{level}}$]$: {{message}} {{path}}';

/**
 * Se deve exibir [YYYY-MM-DD HH:mm:ss] nos logs.
 *
 * O timestamp já é exibido pelo serviço de deploy.
 */
const SHOW_TIMESTAMP = process.env.NODE_ENV !== 'production';

/**
 * Se deve exibir o diretório do arquivo responsável pelo log.
 */
const SHOW_PATH = process.env.NODE_ENV !== 'production';

/**
 * Substitui a tag timestamp do template. Caso a flag SHOW_TIMESTAMP
 * esteja false, o timestamp é exibido como vazio.
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
 * Substitui a tag nível do template.
 */
function replaceLevel(template: string, info: TransformableInfo) {
  return template.replace('{{level}}', chalk.bold(info.level));
}

/**
 * Substitui a tag path do template.
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
 * Substitui a tag label do template.
 *
 * Campos do metadata que começam com "_logs_" são campos injetados pelo código
 * para uma organização dos logs. Por isso não são exibidos nos logs finais.
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
 * Substitui a tag mensagem do template.
 */
function replaceMessage(template: string, info: TransformableInfo) {
  /**
   * É feito uma limpeza complexa para exibir a mensagem final.
   *
   * Além do campo "message", também é possível providenciar várias outras
   * mensagens e até um metadata.
   *
   * Quando é enviado um log simples `logger.info('Hello World')`, 'Hello World'
   * é a propriedade simples `info.message`.
   *
   * Quando é enviado um log com um metadado `logger.info('Hello', { ok: true })`,
   * 'Hello' é a propriedade simples `info.message` e { ok: true } é a propriedade
   * info.metadata.
   *
   * Quando é enviado uma sequência de mensagens `logger.info('Hello', 'World')`,
   * 'Hello' é a propriedade simples `info.message` e 'World' é a propriedade
   * info[Symbol.for('splat')]. Mas nesses casos, o restantes da mensagens serão
   * exibidos como um array de strings.
   *
   * Também há casos de enviar um objeto em algum parâmetro aleatório, ele acabar
   * vindo de dentro do campo Symbol('splat'), e etc.
   *
   * A complexidade abaixo faz uma limpeza nos campos message, metadata e Symbol('splat'),
   * para exibir fielmente a mensagem final.
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
     * O splat também adiciona o metadata em sua composição.
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
 * É possível que sobre alguns valores ainda não substituídos, ou até mesmo
 * colchetes com nenhum valor internamente.
 *
 * Essa função limpará e removerá esses resquícios.
 *
 * Exemplos:
 * - Antes: [] [{{label}} / ERROR]: Wrong value
 * - Depois: [ERROR]: Wrong value
 *
 * - Antes: [2024-01-24 13:25:27] [METRITO / INFO]: Starting
 * - Depois: [2024-01-24 13:25:27] [METRITO / INFO]: Starting (nada muda, pois nenhum valor está faltando)
 */
function cleanMessage(message: string) {
  return message
    .replace(/{{.+?}}/g, '') // remove tags: '{{something}}' -> ''
    .replace(/\$\[\$\]/g, '') // remove colchetes vázios: '[]' -> ''
    .replace(/undefined/g, '') // remove valores undefined
    .replace(/\[ \$\/ /g, '[') // remove a barra desnecessária: '[ / INFO]' -> '[INFO]'
    .trim();
}

/**
 * Aplica uma cor cinza para caracteres especiais do template.
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
   * Transforma o nível em upper case. No console ficará:
   * ao invés de "info", ficará "INFO".
   * etc...
   */
  format((info) => {
    info.level = info.level.toUpperCase();

    return info;
  })(),

  /**
   * Injeta o campo metadata no campo info de printf.
   * Metadata é um campo providenciado nas funções de logs.
   * Exemplo: `logger.info('Hello', { thisIsMetadata: true })`
   */
  format.metadata(),

  /**
   * Aplica colorização para cada nível
   */
  format.colorize(),

  /**
   * Formata o log final no formato do LOG_TEMPLATE.
   */
  format.printf((info) => {
    /**
     * Recria uma cópia do template para começar a substituir as tags {{}} por
     * valores reais.
     */
    let template = LOG_TEMPLATE;

    if (SHOW_PATH) {
      template = replacePath(template);
    }

    template = replaceTimestamp(template);
    template = replaceLevel(template, info);
    template = replaceContext(template, info);

    /**
     * Caso o metadata esteja vazio, deleta-o para não exibir nos logs.
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
