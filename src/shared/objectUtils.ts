/**
 * File containing utility functions for object manipulation or debugging
 */

import util from 'util';

/**
 * Checks if an object is empty (has no keys and values).
 */
const isEmpty = (object: object | null | undefined): boolean =>
  object ? Object.keys(object).length === 0 : true;

/**
 * Inspects the object passed as a parameter using util.inspect.
 */
const inspect = (object: object, depth = 5): string =>
  util.inspect(object, false, depth, true);

/**
 * Converts an object to JSON using default parameters (replacer as null
 * and space as 2).
 */
const json = (object: object): string => JSON.stringify(object, null, 2);

export default {
  isEmpty,
  inspect,
  json,
};
