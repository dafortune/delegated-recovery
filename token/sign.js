'use strict'

// TODO If an alternative is found replace this module by a more widespread
// one and with better support from community.

const concatenatedOctetSequence = require('../concatenated-octet-sequence')
const crypto = require('crypto')

const VALID_HEADER = '-----BEGIN EC PRIVATE KEY-----';
const VALID_TAIL = '-----END EC PRIVATE KEY-----';

module.exports = function sign(options, values, privateKeyPem) {
  if (options === null || typeof options !== 'object') {
    throw new Error('options must be an object');
  }

  if (!options.schema) {
    throw new Error('schema is required')
  }

  if (values === null || typeof values !== 'object') {
    throw new Error('values must be an object containing the values to encode based on the schema')
  }

  if (typeof privateKeyPem !== 'string' || privateKeyPem.indexOf(VALID_HEADER) !== 0 ||
    privateKeyPem.indexOf(VALID_TAIL) !== privateKeyPem.length - VALID_TAIL.length) {
    throw new Error('privateKeyPem must be a valid private key pem as string');
  }

  const encoded = concatenatedOctetSequence.encode(options.schema, values);

  const sign = crypto.createSign('sha256');

  sign.update(encoded);

  return Buffer.concat([
      encoded,
      sign.sign(privateKeyPem, 'buffer')
    ])
    .toString('base64');
};
