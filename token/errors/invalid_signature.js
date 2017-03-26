'use strict';

const InvalidTokenError = require('./invalid_token');

module.exports = class InvalidSignatureError extends InvalidTokenError {
  constructor(message) {
    super(message)

    Error.captureStackTrace(this, InvalidSignatureError);

    this.name = 'InvalidSignatureError';
    this.code = 'invalid_signature';
  }
}
