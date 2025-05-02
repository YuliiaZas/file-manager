import log from '../utils/logger.js';
import { handleNavigation } from '../commands/navigation.js';
import { handleFileOperations } from '../commands/fileOperations.js';

export const handleCommand = async (input) => {
  const [command, ...args] = input.trim().split(/\s+/);

  try {
    switch (command) {
      case 'up':
      case 'cd':
      case 'ls':
        await handleNavigation(command, args);
        break;

      case 'cat':
      case 'add':
      case 'mkdir':
      case 'rn':
      case 'cp':
      case 'mv':
      case 'rm':
        await handleFileOperations(command, args);
        break;

      case '.exit':
        break;

      default:
        log.error('Invalid input');
        break;
    }
  } catch (err) {
    log.error('Operation failed', err.message);
  }
};
