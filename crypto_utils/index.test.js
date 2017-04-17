'use strict';

const cryptoUtils = require('./');
const expect = require('chai').expect;
const async = require('async');

describe('crypto utils', function() {
  const passwords = [
    {
      id: 'p0',
      secret: 'password0password0password0password0'
    },
    {
      id: 'p1',
      secret: 'password1password1password1password1'
    },
    {
      id: 'p2',
      secret: 'password2password2password2password2'
    }
  ];

  const encryptedWithP1 = 'Fe26.2*p1*703fab4d532710629bdc676f69cb2768639438a6efd396d552722a6558c4d7ae*' +
  'fGPw-x88OBtu_QkGLUfY7w*SUx7ijx5Q_5j5LS2x8nNHaa--QkelXDfJkBF47I_4NM**50d08ddd73956828e55f88e13fa88b1' +
  'c62dc40955a16ef5ae045319ce831d669*nzV2W_pju_UTX4Wdi6p3AVXcyfVTqRenwgi7j337nTY';

  const decrypedData = { data: 'hello!' };

  describe('using a valid password for decryption', function() {
    it('returns the decryped data supporting key rotation', function() {
      return cryptoUtils.decrypt(encryptedWithP1, passwords)
        .then(data => {
          expect(data).to.eql(decrypedData);
        });
    });
  });

  describe('using a password to encrypt', function() {
    // WARNING: The following checks won't ensure that the encryption algorithm
    // is a good one, it will just check for some pretty basic properties
    // you need much more to ensure that the algorithm is a good one. Even
    // an encoding algorithm (which is not good for encryption, of course) would
    // pass the following checks.
    //
    // It just checks that it can be decrypted; make sure to check the properties of
    // the encryption algorithm of your choise
    it('returns the encrypted data', function() {
      return cryptoUtils.encrypt(decrypedData, passwords[0])
        .then(encryptedData => {
          expect(encryptedData).to.be.an.instanceOf(Buffer);

          let parsed;
          try {
            parsed = JSON.parse(encryptedData.toString('utf8'));
          } catch(e) {
            // It might (and probably will) not be parseable
          }

          // If it is parseable we expect it not to match decrypedData
          expect(parsed).not.to.eql(decrypedData);

          return encryptedData;
        })
        .then(encryptedData => cryptoUtils.decrypt(encryptedData, passwords))
        .then(data => {
          expect(data).to.eql(decrypedData);
        });
    });
  });

  describe('evaluation of the same input with same password', function() {
    it('generates different output every time', function() {
      Promise.all([
        cryptoUtils.encrypt(decrypedData, passwords[0]),
        cryptoUtils.encrypt(decrypedData, passwords[0])
      ])
      .then((err, encrypted) => {
        expect(encrypted[1].equals(encrypted[2])).to.be.false;
      });
    });
  });
});
