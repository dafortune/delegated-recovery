
const SCHEMA = require('./token_schema');
const cryptoUtils = require('../../crypto_utils');
const sign = require('../../token').sign;
const dateUtils = require('../utils/date');
const assert = require('../../assert');

/**
 * @param {Object} options
 * @param {string} options.issuer
 * @param {string} options.audience
 * @param {string} options.binding
 * @param {string} options.privateKeyPem
 * @param {string} options.encryptionPassword
 * @param {Object} recoveryData
 *
 * @returns {Promise.<string>} Promise for token
 */
module.exports = function buildDelegateToken(options, recoveryData) {
  const now = new Date();

  return cryptoUtils.encrypt(recoveryData, options.encryptionPassword)
    .then(encryptedData => {
      const token = sign({ schema: SCHEMA }, {
        version: 0,
        type: 0,
        token_id: crypto.randomBytes(16),
        options: 0,
        issuer: options.issuer,
        audience: options.audience,
        issued_time: dateUtils.formatUtcIsoDate(now),
        data: encryptedData,
        binding: options.binding
      }, options.privateKeyPem);
  });
};
