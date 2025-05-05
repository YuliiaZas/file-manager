import { createReadStream, createWriteStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { pipeline } from 'node:stream/promises';
import { createBrotliCompress, createBrotliDecompress } from 'node:zlib';
import { defaultExtension, pathAbsent } from '../utils/constants.js';
import { confirmAction } from '../cli/rl.js';
import { log } from '../utils/logger.js';
import { throwIfExists } from '../utils/entityExist.js';

export const handleCompression = async (command, args) => {
  if (args.length === 0) {
    throw new Error(pathAbsent);
  }

  if (!(await stat(args[0])).isFile()) {
    throw new Error(`${args[0]} is not a file`);
  }

  switch (command) {
    case 'compress':
      await compressFile(args);
      break;
    case 'decompress':
      await decompressFile(args);
      break;
  }
};

async function compressFile([source, destination]) {
  if (!destination) {
    const defaultDest = `${source}${defaultExtension}`;

    const useDefault = await confirmAction(`No destination provided. Use default name "${defaultDest}"?`);
    if (!useDefault) {
      log.warning('Compression cancelled by user');
      return;
    }

    destination = defaultDest;
  }

  await pipeline(
    createReadStream(source),
    createBrotliCompress(),
    createWriteStream(destination),
    { end: false },
  );

  log.info(`File ${source} compressed to ${destination}`);
}

export async function decompressFile([source, destination]) {
  if (!destination) {
    if (!source.endsWith(defaultExtension)) {
      log.warning(`No destination provided and source does not end with ${defaultExtension} — cannot suggest default`);
      return;
    }

    const defaultDest = source.slice(0, defaultExtension.length * -1);
    const useDefault = await confirmAction(`No destination provided. Use default name "${defaultDest}"?`);

    if (!useDefault) {
      log.warning('Decompression cancelled by user');
      return;
    }

    destination = defaultDest;
  }

  await throwIfExists(destination);

  await pipeline(
    createReadStream(source),
    createBrotliDecompress(),
    createWriteStream(destination)
  );

  log.info(`File ${source} decompressed to ${destination}`);
}
