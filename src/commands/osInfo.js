import os from 'node:os';
import { log } from '../utils/logger.js';
import { InvalidInputError } from '../utils/errors.js';

export const handleOsInfo = ([flag]) => {
  switch (flag) {
    case '--EOL':
      log.info(`EOL: ${JSON.stringify(os.EOL)}`);
      break;
    case '--cpus': {
      const cpus = os.cpus();
      log.info(`Total CPUs: ${cpus.length}`);
      cpus.forEach((cpu, index) => {
        log.default(`CPU #${index + 1}: ${cpu.model}, ${Math.round(cpu.speed)} MHz`);
      });
      break;
    }
    case '--homedir':
      log.info(`Home directory: ${os.homedir()}`);
      break;
    case '--username':
      log.info(`Current user name: ${os.userInfo().username}`);
      break;
    case '--architecture':
      log.info(`CPU architecture: ${os.arch()}`);
      break;
    default:
      throw new InvalidInputError(`Unknown OS info flag: ${flag}`);
  }
};
