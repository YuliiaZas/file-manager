import { argv, exit } from 'node:process';
import { handleCommand } from './cli/index.js';
import { rl } from './cli/rl.js';
import { log } from './utils/logger.js';

let username = 'Anonymous';
const usernameArg = argv.find(arg => arg.startsWith('--username='));
if (usernameArg) {
  username = usernameArg.split('=')[1] || username;
}

const setForNewCommand = () => {
  log.path();
  rl.prompt();
};

log.greet(`Welcome to the File Manager, ${username}!`);
setForNewCommand();

rl.on('line', async (line) => {
  const command = line.trim();

  if (command === '.exit') {
    exitApp();
    return;
  }

  await handleCommand(command);

  await new Promise(resolve => setTimeout(resolve, 0));
  setForNewCommand();
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
