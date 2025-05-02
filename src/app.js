import { argv, exit } from 'node:process';
import readline from 'node:readline';
import log from './utils/logger.js';

let username = 'Anonymous';
const usernameArg = argv.find(arg => arg.startsWith('--username='));
if (usernameArg) {
  username = usernameArg.split('=')[1] || username;
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '> '
});

log.greet(`Welcome to the File Manager, ${username}!`);
log.path();
rl.prompt();

rl.on('line', (line) => {
  const command = line.trim();

  if (command === '.exit') {
    exitApp();
    return;
  }

  log.error('Invalid input');

  log.path();
  rl.prompt();
});

rl.on('SIGINT', () => {
  log.default('Ctrl+C');
  exitApp();
});

function exitApp() {
  log.greet(`Thank you for using File Manager, ${username}, goodbye!`);
  rl.close();
  exit();
}
