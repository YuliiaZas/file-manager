import { createReadStream } from 'node:fs';
import { createHash } from 'node:crypto';
import { pipeline } from 'node:stream/promises';
import { log } from '../utils/logger.js';
import { throwIfNotFile } from '../utils/validate.js';
import { InvalidInputError } from '../utils/errors.js';

export const handleHash = async ([path]) => {
  if (!path) {
    throw new InvalidInputError(pathAbsent);
  }

  await throwIfNotFile(path);

  const hash = createHash('sha256');
  await pipeline(
    createReadStream(path),
    hash
  );

  const digest = hash.digest('hex');
  log.info(`SHA-256 hash of ${path}: ${digest}`);
};
