import { homedir } from 'node:os';
import { chdir, cwd } from 'node:process';
import { OperationError } from './errors.js';

let currentDir;
const rootDir = homedir();
setCurrentDir(rootDir);

export function getCurrentDir() {
  return currentDir;
}

export function setCurrentDir(newDir) {
  try {
    chdir(newDir);
    currentDir = cwd();
  } catch (error) {
    throw new OperationError(`No such directory "${newDir}"`);
  }
}

export function isRootDir() {
  return currentDir === rootDir;
}

export function hasCurrentRoot(target) {
  return target.startsWith(rootDir);
}
