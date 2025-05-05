import { log } from '../utils/logger.js';

const COMMANDS = [
  { command: 'up', description: 'Go up one directory' },
  { command: 'cd <path>', description: 'Change working directory, using relative or absolute path' },
  { command: 'ls', description: 'List directory content' },
  { command: 'cat <path>', description: 'Read file content and print it to console' },
  { command: 'add <filename>', description: 'Create empty file in current directory' },
  { command: 'rn <path> <newName>', description: 'Rename file or directory' },
  { command: 'cp <src> <dest>', description: 'Copy file' },
  { command: 'mv <src> <dest>', description: 'Move file' },
  { command: 'rm <path>', description: 'Delete file or directory' },
  { command: 'mkdir <dirname>', description: 'Create a new directory' },
  { command: 'compress <src> [dest]', description: 'Compress file using Brotli and save to a new file with passed or default name' },
  { command: 'decompress <src> [dest]', description: 'Decompress .br file using Brotli to a new file with passed or default (if it is possible) name' },
  { command: 'hash <path>', description: 'Calculate SHA256 hash for file' },
  { command: 'os --EOL', description: 'Show end-of-line marker' },
  { command: 'os --cpus', description: 'Show CPU info' },
  { command: 'os --homedir', description: 'Show home directory' },
  { command: 'os --username', description: 'Show current user name' },
  { command: 'os --architecture', description: 'Show CPU architecture' },
  { command: '.help', description: 'Show all available commands' },
  { command: '.exit or Ctrl+C', description: 'Exit the file manager' },
];

export const handleHelp = () => {
  log.info('Available commands:');
  COMMANDS.forEach(({ command, description }) => {
    log.default(`${command.padEnd(25)} - ${description}`);
  });
};
