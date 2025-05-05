import { parseArgs } from '../utils/parseArgs.js';
import { log } from '../utils/logger.js';
import { handleNavigation } from '../commands/navigation.js';
import { handleFileOperations } from '../commands/fileOperations.js';
import { handleCompression } from '../commands/compression.js';
import { handleOsOperations } from '../commands/osOperations.js';
import { handleHash } from '../commands/hash.js';
import { InvalidInputError } from '../utils/errors.js';

export const handleCommand = async (input) => {
  const [command, ...args] = parseArgs(input);

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

      case 'compress':
      case 'decompress':
        await handleCompression(command, args);
        break;

      case 'os':
        await handleOsOperations(args);
        break;

      case 'hash':
        await handleHash(args);
        break;

      case '.exit':
        break;

      default:
        throw new InvalidInputError(`Unknown command: ${command}`);
    }
  } catch (err) {
    if (err instanceof InvalidInputError) {
      log.error('Invalid input', err.message);
    } else {
      log.error('Operation error', err.message);
    }
  }
};
