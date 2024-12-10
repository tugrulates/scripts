/** @module common/pool */

import { pooledMap as denoPooledMap } from "jsr:@std/async";

export async function pool<T, R>(
  array: Iterable<T> | AsyncIterable<T>,
  iteratorFn: (data: T) => Promise<R>,
  { concurrency = 1 } = {},
): Promise<R[]> {
  return await Array.fromAsync(denoPooledMap(concurrency, array, iteratorFn));
}
