import path from 'node:path';
import { readdir } from 'node:fs/promises';
import {
  getCurrentDir,
  hasCurrentRoot,
  isRootDir,
  setCurrentDir,
} from '../utils/currentDir.js';
import { InvalidInputError, OperationError } from '../utils/errors.js';

const TYPE = {
  directory: 'directory',
  file: 'file',
};

const upDir = () => {
  if (isRootDir()) {
    throw new OperationError('Already at root directory');
  }

  setCurrentDir('..');
};

const changeDir = (target) => {
  const isPathAbsolute = path.isAbsolute(target);

  if (isPathAbsolute && !hasCurrentRoot(target)) {
    throw new OperationError('Access denied: cannot go above root directory');
  }

  setCurrentDir(isPathAbsolute ? target : path.join(getCurrentDir(), target));
};

const listDir = async () => {
  try {
    const dirents = await readdir(getCurrentDir(), { withFileTypes: true });
    const items = dirents.map((dirent) => ({
      Name: dirent.name,
      Type: dirent.isDirectory() ? TYPE.directory : TYPE.file,
    }));

    items.sort((a, b) => {
      if (a.Type !== b.Type) return a.Type === TYPE.directory ? -1 : 1;
      return a.Name.localeCompare(b.Name);
    });

    console.table(items);
  } catch (error) {
    throw error;
  }
};

export const handleNavigation = async (command, args) => {
  switch (command) {
    case 'up':
      upDir();
      break;
    case 'cd':
      if (args.length === 0) {
        throw new InvalidInputError('No destination path provided');
      }
      changeDir(args[0]);
      break;
    case 'ls':
      await listDir();
      break;
  }
};
