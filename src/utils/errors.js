export class AlreadyExistsError extends Error {
  constructor(type, path) {
    super(`${type} with name "${path}" already exists`);
    this.name = 'AlreadyExistsError';
    this.type = type;
    this.path = path;
  }
}

export class InvalidInputError extends Error {
  constructor(message) {
    super(message);
    this.name = 'InvalidInputError';
  }
}

export class OperationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'OperationError';
  }
}

export class NotFileError extends Error {
  constructor(path) {
    super(`"${path}" is not a file`);
    this.name = 'NotFileError';
    this.path = path;
  }
}
