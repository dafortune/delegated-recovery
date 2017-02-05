'use strict'

const expect = require('chai').expect
const encoder = require('./encoder')

describe('encoders', function() {
  let schema
  let values

  beforeEach(function() {
    schema = [
        {
          property: 'string_length',
          type: 'uint8'
        },

        {
          property: 'string_test',
          type: 'string',
          length: { property: 'string_length' }
        },

        {
          property: 'uint8_test',
          type: 'uint8',
        },

        {
          property: 'uint16_test',
          type: 'uint16',
        },

        {
          property: 'int8_test',
          type: 'int8',
        },

        {
          property: 'int16_test',
          type: 'int16',
        },

        {
          property: 'double_test',
          type: 'double',
        },

        {
          property: 'float_test',
          type: 'float',
        },

        {
          property: 'dynamic_size_array_length',
          type: 'int8',
        },

        {
          property: 'dynamic_size_array_test',
          type: 'array',
          items: {
            type: 'int8'
          },
          length: { property: 'dynamic_size_array_length'}
        },

        {
          property: 'fixed_size_array_test',
          type: 'array',
          items: {
            type: 'uint8'
          },
          length: { value: 2 }
        },

        {
          property: 'bytes_test_length',
          type: 'uint8'
        },

        {
          property: 'bytes_test',
          type: 'bytes',
          length: { property: 'bytes_test_length' }
        },

        {
          property: 'fixed_size_bytes_test',
          type: 'bytes',
          length: { value: 4 }
        }
      ]

      values = {
        string_test: 'hello!',
        uint8_test: 52,
        uint16_test: 567,
        int8_test: -12,
        int16_test: -786,
        double_test: 12.5,
        float_test: -15.5,
        dynamic_size_array_test: [1, 6, 9],
        fixed_size_array_test: [1, 4],
        bytes_test: buildBufferFromBytes([1, 2, 3]),
        fixed_size_bytes_test: buildBufferFromBytes([4, 5, 6, 7]),
      }
  })

  describe('when schema and properties are valid', function() {
    it('returns a valid octet sequence', function() {
      expect(encoder(schema, values)).to.eql(buildBufferFromBytes([
        6, 104, 101, 108, 108, 111, 33, 52, 2, 55, 244, 252,
        238, 64, 41, 0, 0, 0, 0, 0, 0, 193, 120, 0, 0, 3, 1, 6, 9, 1, 4,
        3, 1, 2, 3, 4, 5, 6 ,7
      ]))
    })
  })

  describe('when schema is missing', function() {
    it('throws an error', function() {
      expect(() => encoder(null, values)).to.throw().and.have.property('message', 'schema must be an array')
    })
  })

  describe('when schema is not an array', function() {
    it('throws an error', function() {
      expect(() => encoder({}, values)).to.throw().and.have.property('message', 'schema must be an array')
    })
  })

  describe('when values is missing', function() {
    it('throws an error', function() {
      expect(() => encoder(schema, null)).to.throw().and.have.property('message', 'values must be an object')
    })
  })

  describe('when values is not an object', function() {
    it('throws an error', function() {
      expect(() => encoder(schema, [])).to.throw().and.have.property('message', 'values must be an object')
    })
  })

  describe('when value for a property does not match type', function() {
    it('throws an error', function() {
      values.uint16_test = 'hola'
      expect(() => encoder(schema, values)).to.throw().and.have.property('message', 'Error writing property uint16_test: value must be a number')
    })
  })

  describe('when there is a missing associated property schema', function() {
    it('throws an error', function() {
      // delete dynamic_size_array_length
      schema.splice(8, 1)
      expect(() => encoder(schema, values)).to.throw().and.have.property('message', 'Missing schema for property dynamic_size_array_length associated with dynamic_size_array_test')
    })
  })

  describe('when type is not set in a descriptor property', function() {
    it('throws an error', function() {
      delete schema[3].type
      expect(() => encoder(schema, values)).to.throw().and.have.property('message', 'Type not defined on schema for property uint16_test')
    })
  })

  describe('when property is not set in descriptor property', function() {
    it('throws an error', function() {
      delete schema[3].property
      expect(() => encoder(schema, values)).to.throw().and.have.property('message', 'Property not defined for schema on index 3')
    })
  })
})

function buildBufferFromBytes(bytes) {
  const buffer = new Buffer(bytes.length)

  bytes.forEach((byte, index) => {
    buffer[index] = byte
  })

  return buffer
}
