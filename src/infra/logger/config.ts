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
   * Diretório que ficarão salvo os logs de erros causados em requisições http.
   */
  HTTP_ERROR_LOGS_DIR: path.resolve(LOGS_DIR, 'http_errors'),

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
