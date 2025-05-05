import { createReadStream, createWriteStream } from 'node:fs';
import {
  mkdir,
  readdir,
  rename as fsRename,
  rm,
  stat,
  unlink,
  writeFile,
} from 'node:fs/promises';
import { join } from 'node:path';
import { pipeline } from 'node:stream/promises';
import { confirmAction } from '../cli/rl.js';
import { log } from '../utils/logger.js';
import { pathAbsent, destPathAbsent } from '../utils/constants.js';
import { throwIfExists } from '../utils/validate.js';
import { AlreadyExistsError, InvalidInputError, OperationError } from '../utils/errors.js';

const VALIDATION_ERROR_MAP = {
  'cat': [pathAbsent],
  'add': [pathAbsent],
  'mkdir': ['No directory name provided'],
  'rn': [pathAbsent, 'No new file name provided'],
  'cp': [pathAbsent, destPathAbsent],
  'mv': [pathAbsent, destPathAbsent],
  'rm': [pathAbsent],
};

const validate = (args, command) => {
  if (args.length === 0) {
    throw new InvalidInputError(VALIDATION_ERROR_MAP[command][0]);
  }
  if (VALIDATION_ERROR_MAP[command].length === 2 && args.length < 2) {
    throw new InvalidInputError(VALIDATION_ERROR_MAP[command][1]);
  }
};

export const handleFileOperations = async (command, args) => {
  validate(args, command);

  switch (command) {
    case 'cat':
      await readFile(args[0]);
      break;
    case 'add':
      await createFile(args[0]);
      break;
    case 'mkdir':
      await createDir(args[0]);
      break;
    case 'rn':
      await renamePath(args);
      break;
    case 'cp':
      await copyPathTo(args);
      break;
    case 'mv':
      await copyPathTo(args, true);
      break;
    case 'rm':
      await deletePath(args[0]);
      break;
  }
};

async function readFile(path) {
  await pipeline(
    createReadStream(path, { encoding: 'utf-8' }),
    process.stdout,
    { end: false },
  );
  process.stdout.write('\n');
}

async function createFile(path) {
  await writeFile(path, '', { flag: 'wx' });
  log.info(`File ${path} created`);
}

async function createDir(path) {
  // comment for reviewers: `throwIfExists` is used here to avoid silent overriding if the directory or the file already exists
  await throwIfExists(path);

  await mkdir(path, { recursive: true });
  log.info(`Directory ${path} created`);
}

async function renamePath([path, newPath]) {
  const entityType = (await stat(path)).isDirectory() ? 'Directory' : 'File';
  // comment for reviewers: `throwIfExists` is used here to avoid silent overriding if the directory or the file already exists
  await throwIfExists(newPath);
  
  await fsRename(path, newPath);
  log.info(`${entityType} ${path} renamed to ${newPath}`);
}

async function deletePath(path) {
  const isDirectory = (await stat(path)).isDirectory();
  const entityType = isDirectory ? 'Directory' : 'File';
  const isConfirmed = await confirmAction(`Are you sure you want to delete ${entityType} ${path}?`);

  if (!isConfirmed) {
    log.warning(`${entityType} deletion cancelled`);
    return;
  }

  await (isDirectory ? rm(path, { recursive: true, force: true }) : unlink(path));

  log.info(`${entityType} ${path} deleted`);
}

async function copyPathTo([source, destination], deleteSource = false) {
  const sourceStat = await stat(source);
  let shouldCopy = true;
  let entityType = sourceStat.isDirectory() ? 'Directory' : 'File';

  try {
    await throwIfExists(destination);
  } catch (error) {
    if (error instanceof AlreadyExistsError) {
      shouldCopy = await confirmAction(`${error.message}. Overwrite?`);
      if (!shouldCopy) {
        log.warning(`Operation ${deleteSource ? 'move' : 'copy'} cancelled`);
        return;
      }
    } else if (error.code !== 'ENOENT') {
      throw error;
    }
  }

  if (sourceStat.isFile()) {
    await pipeline(
      createReadStream(source),
      createWriteStream(destination),
      { end: false },
    );
  } else if (sourceStat.isDirectory()) {
    await mkdir(destination, { recursive: true });
    const entries = await readdir(source, { withFileTypes: true });

    for (const entry of entries) {
      const srcPath = join(source, entry.name);
      const destPath = join(destination, entry.name);
      await copyPathTo([srcPath, destPath]);
    }
  } else {
    throw new OperationError(`${source} is not a valid file or directory`);
  }

  if (deleteSource) {
    await deletePath(source);
  }

  log.info(`${entityType} ${source} ${deleteSource ? 'moved' : 'copied'} to ${destination}`);
}
