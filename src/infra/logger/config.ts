import path from 'node:path';

const LOGS_DIR = 'logs';

const loggerConfig = {
  /**
   * True para exibir logs de debug também.
   *
   * Não é uma boa prática deixar logs de debugs serem exibidos em produção.
   */
  SHOW_DEBUG_LEVEL: process.env.NODE_ENV !== 'production',

  /**
   * True para armazenar os logs de atividades em logs/activity.
   */
  STORE_ACTIVITY_LOGS: true,

  /**
   * True para armazenar os logs de erros em logs/errors.
   */
  STORE_ERROR_LOGS: true,

  /**
   * True para armazenar os logs de erros de requisições http em logs/http_errors.
   */
  STORE_HTTP_ERROR_LOGS: true,

  /**
   * True para armazenar os logs de atividades no banco de dados.
   */
  DATABASE_STORE_ACTIVITY_LOGS: true,

  /**
   * True para armazenar os logs de erros no banco de dados.
   */
  DATABASE_STORE_ERROR_LOGS: true,

  /**
   * True para armazenar os logs de erros de requisições http no banco de dados.
   */
  DATABASE_STORE_HTTP_ERROR_LOGS: true,

  /**
   * True para armazenar nos arquivos de logs, além de requisições http de
   * status 500, também 400.
   */
  INCLUDES_400_ERRORS: true,

  /**
   * True para armazenar no banco de dados, além de requisições http de
   * status 500, também 400.
   */
  DATABASE_INCLUDES_400_ERRORS: true,

  /**
   * Diretório que ficarão salvo os logs localmente.
   */
  LOGS_DIR,

  /**
   * Diretório que ficarão salvo os logs de atividades.
   */
  ACTIVITY_LOGS_DIR: path.resolve(LOGS_DIR, 'activities'),

  /**
   * Diretório que ficarão salvo os logs de erros.
   */
  ERROR_LOGS_DIR: path.resolve(LOGS_DIR, 'errors'),

  /**
   * URL do banco de dados que será armazenado as logs.
   */
  DATABASE_URL: process.env.DATABASE_URL,

  /**
   * Diretório que ficarão salvo os logs de erros causados em requisições http.
   */
  HTTP_ERROR_LOGS_DIR: path.resolve(LOGS_DIR, 'http_errors'),

  /**
   * Collection do banco de dados que ficarão salvo os logs de atividades.
   */
  ACTIVITY_LOGS_COLLECTION: 'logs_activities',

  /**
   * Collection do banco de dados que ficarão salvo os logs de erros.
   */
  ERROR_LOGS_COLLECTION: 'logs_errors',

  /**
   * Collection do banco de dados que ficarão salvo os logs de erros causados
   * em requisições http.
   */
  HTTP_ERROR_LOGS_COLLECTION: 'logs_http_errors',

  /**
   * Tamanho máximo por arquivo de logs.
   */
  MAX_SIZE_PER_FILE: 250 * 1024 * 1024, // 250mb

  /**
   * Extensão dos arquivos de logs.
   */
  LOGS_FILE_EXTENSION: '.log',

  /**
   * Se true, os arquivos de logs sempre estarão zipados para uma compressão
   * no tamanho.
   */
  LOGS_FILE_ZIPPED: false,
};

export default loggerConfig;
