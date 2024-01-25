/**
 * File containing various utility functions.
 */

import path from 'node:path';

/**
 * Hack to generate a random number between min and max.
 */
const random = (min = 0, max = 1): number => Math.random() * (max - min) + min;

/**
 * Pause execution for a defined period.
 */
const wait = (ms = random(200, 1500)): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Remove color characters from a string.
 */
const removeANSIColors = (input: string): string =>
  input.replace(
    /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
    '',
  );

/**
 * Returns the current file path.
 *
 * It may not have been registered yet.
 */
function currentPath(): string | undefined {
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
