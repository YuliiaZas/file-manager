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

const writeToStdout = (type, message, args = []) => {
  const colorCode = COLORS_MAP[type] || COLORS.reset;

  if (type === 'path' && !message) {
    message = `You are currently in ${getCurrentDir()}`;
  } else if (type === 'error' && args.length > 0) {
    message = `${message}.${COLORS.reset} Reason: ${args.join(' ')}`;
  }

  stdout.write(`${colorCode}${message}${COLORS.reset}\n`);
}


const log = {
  default: (message) => writeToStdout('default', message),
  info: (message) => writeToStdout('info', message),
  error: (message, ...args) => writeToStdout('error', message, args),
  path: (message) => writeToStdout('path', message),
  greet: (message) => writeToStdout('greet', message),
};

export default log;
