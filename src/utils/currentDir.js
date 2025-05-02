import { homedir } from 'node:os';
import { chdir } from 'node:process';

let currentDir = homedir();
chdir(currentDir);

export const getCurrentDir = () => currentDir;

export const setCurrentDir = (newDir) => {
  chdir(currentDir);
  currentDir = newDir;
};
