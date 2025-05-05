import readline from 'node:readline';

export const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '> '
});

export const confirmAction = (message) =>
  new Promise(resolve =>
    rl.question(`${message} (y/n): `, answer => resolve(answer.toLowerCase() === 'y'))
  );
