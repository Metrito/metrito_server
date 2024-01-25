/**
 * Arquivo com algumas funções utilitárias para manipulação ou debug de objetos
 */

import util from 'util';

/**
 * Verifica se um objeto está vazio (não possui nenhuma chave e valor).
 */
const isEmpty = (object: object | null | undefined) =>
  object ? Object.keys(object).length === 0 : true;

/**
 * Inspecione o objeto passado como parâmetro, usando o util.inspect
 */
const inspect = (object: object, depth = 5) =>
  util.inspect(object, false, depth, true);

/**
 * Converta um objeto em JSON utilizando parâmetros padrões (replacer como null
 * e space como 2)
 */
const json = (object: object) => JSON.stringify(object, null, 2);

export default {
  isEmpty,
  inspect,
  json,
};
