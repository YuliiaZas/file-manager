import { createReadStream, createWriteStream } from 'node:fs';
import { access, constants, mkdir, rename as fsRename, unlink, writeFile } from 'node:fs/promises';
import { pipeline } from 'node:stream/promises';
import { confirmAction, rl } from '../cli/rl.js';
import { log } from '../utils/logger.js';

const pathAbsent = 'No file path provided';
const destPathAbsent = 'No destination path provided';

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
    throw new Error(VALIDATION_ERROR_MAP[command][0]);
  }
  if (VALIDATION_ERROR_MAP[command].length === 2 && args.length < 2) {
    throw new Error(VALIDATION_ERROR_MAP[command][1]);
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
      await renameFile(args);
      break;
    case 'cp':
      await copyFileTo(args);
      break;
    case 'mv':
      await copyFileTo(args, true);
      break;
    case 'rm':
      await deleteFile(args[0]);
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
  await mkdir(path, { recursive: true });
  log.info(`Directory ${path} created`);
}

async function renameFile([path, newPath]) {
  try {
    await access(newPath, constants.F_OK);
    throw fsError;
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  
  await fsRename(path, newPath);
  log.info(`File ${path} renamed to ${newPath}`);
}

async function copyFileTo([path, destination], deleteSource = false) {
  let shouldCopy = true;
  try {
    await access(destination, constants.F_OK);
    shouldCopy = await confirmAction(`File ${destination} already exists. Overwrite?`);

    if (!shouldCopy) {
      log.warning(`File ${deleteSource ? 'move' : 'copy'} cancelled`);
      return;
    }
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }

  await pipeline(
    createReadStream(path),
    createWriteStream(destination),
    { end: false },
  );
  if (deleteSource) {
    await unlink(path);
  }
  log.info(`File ${path} ${deleteSource ? 'moved' : 'copied'} to ${destination}`);
}

async function deleteFile(path) {
  rl.pause();

  const isConfirmed = await confirmAction(`Are you sure you want to delete ${path}?`);

  if (isConfirmed) {
    await unlink(path);
    log.info(`File ${path} deleted`);
  } else {
    log.warning('File deletion cancelled');
  }

  rl.resume();
}
