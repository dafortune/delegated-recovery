'use strict'

const expect = require('chai').expect
const decoder = require('./decoder')

describe('decoder', function() {
  let schema
  let values
  let sequence

  beforeEach(function() {
    sequence = buildBufferFromBytes([
      6, 104, 101, 108, 108, 111, 33, 52, 2, 55, 244, 252,
      238, 64, 41, 0, 0, 0, 0, 0, 0, 193, 120, 0, 0, 3, 1, 6, 9, 1, 4,
      3, 1, 2, 3, 4, 5, 6 ,7
    ])

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
        string_length: 6,
        string_test: 'hello!',
        uint8_test: 52,
        uint16_test: 567,
        int8_test: -12,
        int16_test: -786,
        double_test: 12.5,
        float_test: -15.5,
        dynamic_size_array_length: 3,
        dynamic_size_array_test: [1, 6, 9],
        fixed_size_array_test: [1, 4],
        bytes_test_length: 3,
        bytes_test: buildBufferFromBytes([1, 2, 3]),
        fixed_size_bytes_test: buildBufferFromBytes([4, 5, 6, 7]),
      }
  })

  describe('when schema and properties are valid', function() {
    it('returns the corresponding object', function() {
      expect(decoder(schema, sequence)).to.have.property('properties').and.eql(values)
    })
  })

  describe('when schema is missing', function() {
    it('throws an error', function() {
      expect(() => decoder(null, sequence)).to.throw().and.have.property('message', 'schema must be an array')
    })
  })

  describe('when schema is not an array', function() {
    it('throws an error', function() {
      expect(() => decoder({}, sequence)).to.throw().and.have.property('message', 'schema must be an array')
    })
  })

  describe('when values is missing', function() {
    it('throws an error', function() {
      expect(() => decoder(schema, null)).to.throw().and.have.property('message', 'sequence must be a buffer')
    })
  })

  describe('when values is not an object', function() {
    it('throws an error', function() {
      expect(() => decoder(schema, [])).to.throw().and.have.property('message', 'sequence must be a buffer')
    })
  })

  describe('when there is a missing length property', function() {
    it('throws an error', function() {
      // delete dynamic_size_array_length
      schema.splice(8, 1)
      expect(() => decoder(schema, sequence)).to.throw().and.have.property('message', 'Missing schema for property ' +
      'dynamic_size_array_length associated with dynamic_size_array_test')
    })
  })

  describe('when the length property is after the actual property', function() {
    it('throws an error', function() {
      const dynamicSizeArrayLength = schema[8]
      schema.splice(8, 1)
      schema.push(dynamicSizeArrayLength)
      expect(() => decoder(schema, sequence)).to.throw().and.have.property('message', 'length property ' +
      '(dynamic_size_array_length) for schema dynamic_size_array_test must be before the actual property.')
    })
  })

  describe('when invalid data type is defined', function() {
    it('throws an error', function() {
      const dynamicSizeArrayLength = schema[8]
      dynamicSizeArrayLength.type = 'invalid'
      expect(() => decoder(schema, sequence)).to.throw().and.have.property('message', 'Invalid type defined ' +
      'on schema for property dynamic_size_array_length. Expected types uint8, int8, byte, uint16, int16, ' +
      'double, float, string, bytes, array.')
    })
  })

  describe('when no data type is provided', function() {
    it('throws an error', function() {
      const dynamicSizeArrayLength = schema[8]
      delete dynamicSizeArrayLength.type
      expect(() => decoder(schema, sequence)).to.throw().and.have.property('message', 'Type not defined on schema ' +
      'for property dynamic_size_array_length')
    })
  })

  describe('when no data property is provided', function() {
    it('throws an error', function() {
      const dynamicSizeArrayLength = schema[8]
      delete dynamicSizeArrayLength.property
      expect(() => decoder(schema, sequence)).to.throw().and.have.property('message', 'Property not defined for schema on index 8')
    })
  })

  describe('when length is not provided for a non-fixed length property', function() {
    it('throws an error', function() {
      const dynamicSizeArray = schema[9]
      delete dynamicSizeArray.length
      expect(() => decoder(schema, sequence)).to.throw().and.have.property('message', 'length is required on schema for property dynamic_size_array_test')
    })
  })

  describe('when length provided but has no value nor property', function() {
    it('throws an error', function() {
      const dynamicSizeArray = schema[9]
      dynamicSizeArray.length = {}
      expect(() => decoder(schema, sequence)).to.throw().and.have.property('message', 'value or property is required for ' +
      'property \'length\' on schema dynamic_size_array_test')
    })
  })

  describe('when length provided but has no value nor property', function() {
    it('throws an error', function() {
      const dynamicSizeArray = schema[9]
      dynamicSizeArray.length = {}
      expect(() => decoder(schema, sequence)).to.throw().and.have.property('message', 'value or property is required for ' +
      'property \'length\' on schema dynamic_size_array_test')
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
