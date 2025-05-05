import { stat } from 'node:fs/promises';
import { AlreadyExistsError } from './errors.js';

export const throwIfExists = async (path) => {
  try {
    const type = (await stat(path)).isDirectory() ? 'Directory' : 'File';
    throw new AlreadyExistsError(type, path);
  } catch (err) {
    if (err.code !== 'ENOENT') throw err;
  }
};
