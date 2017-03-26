'use strict';

module.exports = class InvalidTokenError extends Error {
  constructor(message, innerError) {
    super(message)

    Error.captureStackTrace(this, InvalidTokenError);

    this.name = 'InvalidToken';
    this.code = 'invalid_token';
    this.innerError = innerError;
  }
}
