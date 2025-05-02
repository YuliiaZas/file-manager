import { stdout } from 'node:process';
import { getCurrentDir } from './currentDir.js'; 

const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m'
};

const COLORS_MAP = {
  default: COLORS.reset,
  info: COLORS.green,
  error: COLORS.red,
  path: COLORS.blue,
  greet: COLORS.yellow
};

const writeToStdout = (message, type) => {
  const colorCode = COLORS_MAP[type] || COLORS.reset;
  if (type === 'path' && !message) {
    message = `You are currently in ${getCurrentDir()}`;
  }
  stdout.write(`${colorCode}${message}${COLORS.reset}\n`);
}


const log = {
  default: (message) => writeToStdout(message, 'default'),
  info: (message) => writeToStdout(message, 'info'),
  error: (message) => writeToStdout(message, 'error'),
  path: (message) => writeToStdout(message, 'path'),
  greet: (message) => writeToStdout(message, 'greet'),
};

export default log;
