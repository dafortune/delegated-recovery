'use strict';

const sign = require('./sign');
const testFixture = require('./test_fixture.tests');
const expect = require('chai').expect;
const crypto = require('crypto');

describe('token', function() {
  describe('sign', function() {
    describe('when options are not provided', function() {
      it('throws an error', function() {
        expect(() => {
          sign(null, testFixture.fixture1.decoded, testFixture.fixture1.privateKey);
        }).to.throw().and.have.property('message', 'options must be an object');
      });
    });

    describe('when schema is not provided', function() {
      it('throws an error', function() {
        expect(() => {
          sign({ schema: null }, testFixture.fixture1.decoded, testFixture.fixture1.privateKey);
        }).to.throw().and.have.property('message', 'schema is required');
      });
    });

    describe('when values are not provided', function() {
      it('throws an error', function() {
        expect(() => {
          sign({ schema: testFixture.fixture1.schema }, null, testFixture.fixture1.privateKey);
        }).to.throw(Error).and.have.property('message',
          'values must be an object containing ' +
          'the values to encode based on the schema'
        );
      });
    });

    describe('when private key PEM is not provided', function() {
      it('throws an error', function() {
        expect(() => {
          sign({ schema: testFixture.fixture1.schema }, testFixture.fixture1.decoded, null);
        }).to.throw(Error).and.have.property('message', 'privateKeyPem must be a valid private key pem as string');
      });
    });

    describe('when private key PEM header is not valid', function() {
      it('throws an error', function() {
        expect(() => {
          sign({ schema: testFixture.fixture1.schema }, testFixture.fixture1.decoded,
            ['-----BEGIN PRIVATE KEY-----'].concat(testFixture.fixture1.privateKey.split('\n').slice(1)).join('\n'));
        }).to.throw(Error).and.have.property('message', 'privateKeyPem must be a valid private key pem as string');
      });
    });

    describe('when private key PEM tail is not valid', function() {
      it('throws an error', function() {
        expect(() => {
          sign({ schema: testFixture.fixture1.schema }, testFixture.fixture1.decoded,
            testFixture.fixture1.privateKey.split('\n').slice(0, -1).concat(['-----END PRIVATE KEY-----']).join('\n'));
        }).to.throw(Error).and.have.property('message', 'privateKeyPem must be a valid private key pem as string');
      });
    });

    describe('when parameters are valid', function() {
      it('returns the base64 encoded token with the right signature', function() {
        const token = sign({ schema: testFixture.fixture1.schema }, testFixture.fixture1.decoded, testFixture.fixture1.privateKey);

        expect(token.indexOf(testFixture.fixture1.tokenPayloadSegment), 'Invalid encoded token payload').to.equal(0);
        const signature = token.slice(testFixture.fixture1.tokenPayloadSegment.length);
        const verifier = crypto.createVerify('sha256')

        verifier.update(new Buffer(testFixture.fixture1.tokenPayloadSegment, 'base64'));

        expect(verifier.verify(testFixture.fixture1.publicKey, new Buffer(signature, 'base64')));
      });
    });
  });
});
