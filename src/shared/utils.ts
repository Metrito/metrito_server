/**
 * Arquivo com diversas funções utilitárias.
 */

import path from 'node:path';

/**
 * Hack para gerar um número aleatório entre min e max.
 */
const random = (min = 0, max = 1) => Math.random() * (max - min) + min;

/**
 * Faça o código por algum tempo definido.
 */
const wait = (ms = random(200, 1500)) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Remove os caracteres de cor de uma string
 */
const removeANSIColors = (input: string) =>
  input.replace(
    /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
    '',
  );

/**
 * Retorna qual o caminho do arquivo atual.
 *
 * É possível que ainda não tenha sido registrado.
 */
function currentPath() {
  const allPathsRegistered = require.main?.children;

  if (!allPathsRegistered || allPathsRegistered.length === 0) {
    return undefined;
  }

  const lastPathRegistered = allPathsRegistered.length - 1;

  const absolutePath = allPathsRegistered[lastPathRegistered].filename;

  const pathWithoutBaseDir = absolutePath
    .replace(path.resolve(), '')
    .replace('/src/', '')
    .replace('/dir/', '');

  return pathWithoutBaseDir;
}

export default {
  random,
  wait,
  removeANSIColors,
  currentPath,
};
