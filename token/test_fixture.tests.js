'use strict';

const f1TokenPayloadSegment = 'AACqqqqqqqqqqqqqqqqqqqqqAAAOaHR0cHM6Ly9tZS5jb20AFGh0dHBzOi8vd3d3LnRlc3QuY29tABQyMDE3LTAzLTI2VDIzOjU1OjQyWgAkqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqAAKqq';

exports.fixture1 = {
  schema: [
    {
      property: 'version',
      type: 'uint8'
    },

    {
      property: 'type',
      type: 'uint8'
    },

    {
      property: 'token_id',
      type: 'bytes',
      length: { value: 16 }
    },

    {
      property: 'options',
      type: 'uint8'
    },

    {
      property: 'issuer_length',
      type: 'uint16'
    },

    {
      property: 'issuer',
      type: 'string',
      length: { property: 'issuer_length' }
    },

    {
      property: 'audience_length',
      type: 'uint16'
    },

    {
      property: 'audience',
      type: 'string',
      length: { property: 'audience_length' }
    },

    {
      property: 'issued_time_length',
      type: 'uint16'
    },

    {
      property: 'issued_time',
      type: 'string',
      length: { property: 'issued_time_length' }
    },

    {
      property: 'data_length',
      type: 'uint16'
    },

    {
      property: 'data',
      type: 'bytes',
      length: { property: 'data_length' },
    },

    {
      property: 'binding_length',
      type: 'uint16'
    },

    {
      property: 'binding',
      type: 'bytes',
      length: { property: 'binding_length' }
    }
  ],

  token: f1TokenPayloadSegment + 'jBFAiEAwgykEaFzeYJLR7JsHKPreOJU5BidwT7ecAJ0Iid+TLUCIGqe/+CeV1dUQBbcS8opgp/t0weBDAcdymFHFXtLzkui',

  tokenPayloadSegment: f1TokenPayloadSegment,

  decoded: {
    version: 0,
    type: 0,
    token_id: new Buffer('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 'hex'),
    options: 0,
    issuer_length: 14,
    issuer: 'https://me.com',
    audience_length: 20,
    audience: 'https://www.test.com',
    issued_time_length: 20,
    issued_time: '2017-03-26T23:55:42Z',
    data_length: 36,
    data: new Buffer('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 'hex'),
    binding_length: 2,
    binding: new Buffer('aaaa', 'hex')
  },

  publicKey: [
    '-----BEGIN PUBLIC KEY-----',
    'MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEU2eUvr2awpksy9Ipsz2tdDx7gdm+',
    'emNsgglLWSvZR2IDKEnsuME+oGPkWdG0qDPhjlStVDaafZiVdie40WWV6A==',
    '-----END PUBLIC KEY-----'
  ].join('\n'),

  otherPublicKey: [
    '-----BEGIN PUBLIC KEY-----',
    'MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEriQNK6MFwepmp+oXcRrbC3KHLuUP',
    'iBEswly65lEPznI/UQwm0gFNHhqEyCKAt134uqAaICqyuTwmEdLaXc+hXg==',
    '-----END PUBLIC KEY-----'
  ].join('\n'),

  privateKey: [
    '-----BEGIN EC PRIVATE KEY-----',
    'MHcCAQEEIK9dHkWULFKUmFxukjez6z0mnmiSO3XHPFnFCWOrRFBGoAoGCCqGSM49',
    'AwEHoUQDQgAEU2eUvr2awpksy9Ipsz2tdDx7gdm+emNsgglLWSvZR2IDKEnsuME+',
    'oGPkWdG0qDPhjlStVDaafZiVdie40WWV6A==',
    '-----END EC PRIVATE KEY-----'
  ].join('\n')
}
