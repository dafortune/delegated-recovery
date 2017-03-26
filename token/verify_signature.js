'use strict';

// TODO If an alternative is found replace this module by a more widespread
// one and with better support from community.

const concatenatedOctetSeq = require('../concatenated-octet-sequence')
const InvalidTokenError = require('./errors/invalid_token');
const InvalidSignatureError = require('./errors/invalid_signature');
const crypto = require('crypto');

/**
 * @param {Object} options
 * @param {Array.<Object>} options.schema
 * @param {string} publicKeyPem Public key pem string
 * @param {string} token
 */
module.exports = function(options, publicKeyPem, token) {
  if (options === null || typeof options !== 'object') {
    throw new Error('options must be an object');
  }

  let tokenBuffer;
  if (Buffer.isBuffer(token)) {
    tokenBuffer = token;
  } else if (typeof token === 'string') {
    tokenBuffer = new Buffer(token, 'base64');
  } else {
    throw new InvalidTokenError('Token must be a buffer or a base64 encoded string');
  }

  if (typeof publicKeyPem !== 'string') {
    throw new Error('publicKeyPem must be a valid public key pem as string');
  }

  if (!options.schema) {
    throw new Error('schema is required')
  }

  let parsingResult;

  try {
    parsingResult = concatenatedOctetSeq.decode(options.schema, tokenBuffer);
  } catch (e) {
    throw new InvalidTokenError('Token payload is not valid. Check innerError for details', e);
  }

  const verifier = crypto.createVerify('sha256')

  verifier.update(parsingResult.parsed)

  if (verifier.verify(publicKeyPem, parsingResult.left)) {
    return parsingResult.properties;
  } else {
    throw new InvalidSignatureError('Token signature is not valid');
  }
};
