'use strict';

module.exports = [
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
];
