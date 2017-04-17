'use strict';

const Iron = require('iron');
const thenify = require('thenify');

const sealAsync = thenify(Iron.seal.bind(Iron));
const unsealAsync = thenify(Iron.unseal.bind(Iron));

/**
 * @param {string} encrypted
 * @param {Array.<{id, secret}>} passwords
 */
exports.encrypt = function encrypt(obj, password) {
  return sealAsync(obj, password, Iron.defaults)
    .then((sealed) => new Buffer(sealed, 'utf8'));
};

/**
 * @param {buffer} sealed
 * @param {Array.<{id, secret}>} passwords
 */
exports.decrypt = function decrypt(sealed, passwords, cb) {
  // Transform password in the iron expected format
  const ironPassword = passwords.reduce((result, password) => {
    result[password.id] = password.secret;

    return result;
  }, {});

  return unsealAsync(sealed.toString('utf8'), ironPassword, Iron.defaults);
};
