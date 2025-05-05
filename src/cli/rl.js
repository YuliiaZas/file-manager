import readline from 'node:readline';
import { log } from '../utils/logger.js';

export const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '> '
});

export const confirmAction = (message) =>
  new Promise(resolve => {
    log.warning(`${message} (y/n): `);
    rl.question('', answer => resolve(answer.toLowerCase() === 'y'));
  });
