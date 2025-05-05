export class AlreadyExistsError extends Error {
  constructor(type, path) {
    super(`${type} with name "${path}" already exists`);
    this.name = 'AlreadyExistsError';
    this.type = type;
    this.path = path;
  }
}
