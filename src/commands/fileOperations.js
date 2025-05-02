import { createReadStream } from 'node:fs';
import { writeFile, mkdir } from 'node:fs/promises';
import { pipeline } from 'node:stream/promises';
import readline from 'node:readline';
import log from '../utils/logger.js';

const VALIDATION_ERROR_MAP = {
  'cat': ['No file path provided'],
  'add': ['No file path provided', 'No new file name provided'],
  'mkdir': ['No directory name provided'],
  'rn': ['No file name provided', 'No new file name provided'],
  'cp': ['No file path provided', 'No destination path provided'],
  'mv': ['No file path provided', 'No destination path provided'],
  'rm': ['No file path provided'],
};

const validate = (args, command) => {
  if (args.length === 0) {
    throw new Error(VALIDATION_ERROR_MAP[command][0]);
  }
  if (VALIDATION_ERROR_MAP[command] === 2 && args.length < 2) {
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
      await moveFileTo(args);
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
};

async function deleteFile(path) {
  // if (mainInterface) mainInterface.pause();
  // const rl = readline.createInterface({
  //   input: process.stdin,
  //   output: process.stdout,
  // });
  // const isConfirmed = await new Promise((resolve) => {
  //   rl.question(`Are you sure you want to delete ${path}? (y/n): `, (answer) => {
  //     rl.close();
  //     resolve(answer.trim().toLowerCase() === 'y');
  //   });
  // });

  // if (isConfirmed) {
    await unlink(path);
    log.info(`File ${path} deleted`);
  // } else {
  //   log.info('File deletion cancelled');
  // }

  // if (mainInterface) mainInterface.resume();
};
