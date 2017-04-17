'use strict';

const verify = require('./verify_signature');
const testFixture = require('./test_fixture.tests');
const expect = require('chai').expect;
const InvalidTokenError = require('./errors/invalid_token');
const InvalidSignatureError = require('./errors/invalid_signature');

describe('token', function() {
  describe('verify', function() {
    describe('when options are not provided', function() {
      it('throws an error', function() {
        expect(() => {
          verify(null, testFixture.fixture1.publicKey, testFixture.fixture1.token);
        }).to.throw().and.have.property('message', 'options must be an object');
      });
    });

    describe('when schema is not provided', function() {
      it('throws an error', function() {
        expect(() => {
          verify({ schema: null }, testFixture.fixture1.publicKey, testFixture.fixture1.token);
        }).to.throw().and.have.property('message', 'schema is required');
      });
    });

    describe('when buffer is not provided', function() {
      it('throws an error', function() {
        expect(() => {
          verify({ schema: null }, testFixture.fixture1.publicKey, null);
        }).to.throw(InvalidTokenError).and.have.property('message', 'Token must be a buffer or a base64 encoded string');
      });
    });

    describe('when token signature is valid', function() {
      it('returns the decoded token', function() {
        const decoded = verify({ schema: testFixture.fixture1.schema, }, testFixture.fixture1.publicKey, testFixture.fixture1.token);
        expect(decoded).to.deep.equal(testFixture.fixture1.decoded);
      });
    });

    describe('and when using an array of keys', function() {
      describe('when signature is valid against any of the public keys', function() {
        it('returns the decoded token', function() {
          const decoded = verify({ schema: testFixture.fixture1.schema, }, [
            testFixture.fixture1.otherPublicKey,
            testFixture.fixture1.publicKey,
          ], testFixture.fixture1.token);
          expect(decoded).to.deep.equal(testFixture.fixture1.decoded);
        });
      });

      describe('when signature is not valid against any of the public keys', function() {
        it('throws an error', function() {
          expect(() => {
            verify({ schema: testFixture.fixture1.schema, },
              [
                testFixture.fixture1.otherPublicKey,
                testFixture.fixture1.otherPublicKey
              ], testFixture.fixture1.token);
          }).to.throw(InvalidSignatureError).and.have.property('message', 'Token signature is not valid');
        });
      });
    });

    describe('when token signature is not valid', function() {
      it('throws an error', function() {
        expect(() => {
          verify({ schema: testFixture.fixture1.schema, }, testFixture.fixture1.otherPublicKey, testFixture.fixture1.token)
        }).to.throw(InvalidSignatureError).and.have.property('message', 'Token signature is not valid');
      });
    });

    describe('when token payload cannot be decoded', function() {
      it('throws an error', function() {
        const schema = Object.assign([], testFixture.fixture1.schema);
        schema[2] =     {
          property: 'token_id',
          type: 'bytes',
          length: { value: 20 }
        };

        expect(() => {
          verify({ schema }, testFixture.fixture1.publicKey, testFixture.fixture1.token);
        }).to.throw(InvalidTokenError).and.have.property('message', 'Token payload is not valid. Check innerError for details');
      });
    });

    describe('when token payload can be decoded but generates an invalid signature', function() {
      it('throws an error', function() {
        const schema = Object.assign([], testFixture.fixture1.schema);
        schema[13] = {
          property: 'binding',
          type: 'bytes',
          length: { value: 4 }
        };

        expect(() => {
          verify({ schema }, testFixture.fixture1.publicKey, testFixture.fixture1.token);
        }).to.throw(InvalidSignatureError).and.have.property('message', 'Token signature is not valid');
      });
    });
  });
});
