import { stdout } from 'node:process';
import { getCurrentDir } from './currentDir.js'; 

const COLORS = {
  default: '\x1b[0m',
  info: '\x1b[32m',
  warning: '\x1b[33m',
  error: '\x1b[31m',
  path: '\x1b[34m',
  greet: '\x1b[43m'
};

const getFormattedMessage = (type, message, args = []) => {
  if (type === 'path' && !message) {
    return `You are currently in ${getCurrentDir()}`;
  } else if (type === 'error' && args.length > 0) {
    return `${message}.${COLORS.default} Reason: ${args.join(' ')}`;
  }
  return message;
};

const writeToStdout = (type, message, ...args) => {
  const colorCode = COLORS[type] || COLORS.default;
  const foemattedMessage = getFormattedMessage(type, message, args);

  stdout.write(`${colorCode}${foemattedMessage}${COLORS.default}\n`);
};

export const log = new Proxy({}, {
  get(_, type) {
    return (message, ...args) => writeToStdout(type, message, ...args);
  },
});
