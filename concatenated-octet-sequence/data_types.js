'use strict'

const assert = require('../assert')

const types = {
  uint8: {
    type: 'number',

    read(buffer, options) {
      assertBuffer(buffer)
      assertOptions(options)
      assertOffset(options.offset)

      return { value: buffer.readUInt8(options.offset), bytesLength: this.bytes() }
    },

    write(buffer, value, options) {
      assertBuffer(buffer)
      assertOptions(options)
      assertOffset(options.offset)
      assertPositiveOrZeroNumberValue(value)

      buffer.writeUInt8(value, options.offset)

      return this.bytes(value)
    },

    bytes: () => 1,

    length: () => { throw new Error('unsupported operation: length') },

    fixedSize: true
  },
  int8: {
    type: 'number',

    read(buffer, options) {
      assertBuffer(buffer)
      assertOptions(options)
      assertOffset(options.offset)

      return { value: buffer.readInt8(options.offset), bytesLength: this.bytes() }
    },

    write(buffer, value, options) {
      assertBuffer(buffer)
      assertOptions(options)
      assertOffset(options.offset)
      assertNumberValue(value)

      buffer.writeInt8(value, options.offset)

      return this.bytes(value)
    },

    bytes: () => 1,

    length: () => { throw new Error('unsupported operation: length') },

    fixedSize: true
  },
  byte: {
    type: 'buffer',

    read(buffer, options) {
      assertBuffer(buffer)
      assertOptions(options)
      assertOffset(options.offset)

      return { value: buffer.slice(options.offset, options.offset + 1), bytesLength: this.bytes() }
    },

    write(buffer, value, options) {
      assertBuffer(buffer)
      assertOptions(options)
      assertOffset(options.offset)
      assertBufferValue(value)

      if (value.length > 1) {
        throw new Error('buffer to long max length: 1 byte')
      }

      buffer.write(value.toString('hex'), options.offset, 'hex')

      return this.bytes(value)
    },

    bytes: () => 1,

    length: () => { throw new Error('unsupported operation: length') },

    fixedSize: true
  },
  uint16: {
    type: 'number',

    read(buffer, options) {
      assertBuffer(buffer)
      assertOptions(options)
      assertOffset(options.offset)

      return { value: buffer.readUInt16BE(options.offset), bytesLength: this.bytes() }
    },

    write(buffer, value, options) {
      assertBuffer(buffer)
      assertOptions(options)
      assertOffset(options.offset)
      assertPositiveOrZeroNumberValue(value)

      if (typeof value !== 'number' || isNaN(value)) {
        return 'value is not a number'
      }

      if (value < 0) {
        return 'value must be greater than zero'
      }

      buffer.writeUInt16BE(value, options.offset)

      return this.bytes(value)
    },

    bytes: () => 2,

    length: () => { throw new Error('unsupported operation: length') },

    fixedSize: true
  },
  int16: {
    type: 'number',

    read(buffer, options) {
      assertBuffer(buffer)
      assertOptions(options)
      assertOffset(options.offset)

      return { value: buffer.readInt16BE(options.offset), bytesLength: this.bytes() }
    },

    write(buffer, value, options) {
      assertBuffer(buffer)
      assertOptions(options)
      assertOffset(options.offset)
      assertNumberValue(value)

      if (typeof value !== 'number' || isNaN(value)) {
        return 'value is not a number'
      }

      buffer.writeInt16BE(value, options.offset)

      return this.bytes(value)
    },

    bytes: () => 2,

    length: () => { throw new Error('unsupported operation: length') },

    fixedSize: true
  },
  double: {
    type: 'number',

    read(buffer, options) {
      assertBuffer(buffer)
      assertOptions(options)
      assertOffset(options.offset)

      return { value: buffer.readDoubleBE(options.offset), bytesLength: this.bytes() }
    },

    write(buffer, value, options) {
      assertBuffer(buffer)
      assertOptions(options)
      assertOffset(options.offset)
      assertNumberValue(value)

      if (typeof value !== 'number' || isNaN(value)) {
        return 'value is not a number'
      }

      buffer.writeDoubleBE(value, options.offset)

      return this.bytes(value)
    },

    bytes: () => 8,

    length: () => { throw new Error('unsupported operation: length') },

    fixedSize: true
  },
  float: {
    type: 'number',

    read(buffer, options) {
      assertBuffer(buffer)
      assertOptions(options)
      assertOffset(options.offset)

      return { value: buffer.readFloatBE(options.offset), bytesLength: this.bytes() }
    },

    write(buffer, value, options) {
      assertBuffer(buffer)
      assertOptions(options)
      assertOffset(options.offset)
      assertNumberValue(value)

      if (typeof value !== 'number' || isNaN(value)) {
        return 'value is not a number'
      }

      buffer.writeFloatBE(value, options.offset)

      return this.bytes(value)
    },

    bytes: () => 4,

    length: () => { throw new Error('unsupported operation: length') },

    fixedSize: true
  },
  string: {
    type: 'string',

    read(buffer, options) {
      assertBuffer(buffer)
      assertOptions(options)
      assertOffset(options.offset)
      assertLength(options.length)

      return {
        value: buffer.slice(options.offset, options.offset + options.length).toString('utf8'),
        bytesLength: options.length
      }
    },

    write(buffer, value, options) {
      assertBuffer(buffer)
      assertOptions(options)
      assertOffset(options.offset)
      assertStringValue(value)

      buffer.write(value, options.offset)

      return this.bytes(value)
    },

    bytes: (value) => {
      assertStringValue(value)

      return value.length
    },

    length: (value) => {
      assertStringValue(value)

      return value.length
    },

    fixedSize: false
  },
  bytes: {
    type: 'buffer',

    read(buffer, options) {
      assertBuffer(buffer)
      assertOptions(options)
      assertOffset(options.offset)
      assertLength(options.length)

      return {
        value: buffer.slice(options.offset, options.offset + options.length),
        bytesLength: options.length
      }
    },

    write(buffer, value, options) {
      assertBuffer(buffer)
      assertOptions(options)
      assertOffset(options.offset)
      assertBufferValue(value)

      buffer.write(value.toString('hex'), options.offset, 'hex')

      return this.bytes(value)
    },

    bytes: (value) => {
      assertBufferValue(value)

      return value.length
    },

    length: (value) => {
      assertBufferValue(value)

      return value.length
    },

    fixedSize: false
  },
  array: {
    type: 'array',

    read(buffer, options) {
      assertBuffer(buffer)
      assertOptions(options)
      assertOffset(options.offset)
      assertLength(options.length)
      assertItemsOptions(options.items)

      const type = types[options.items.type]
      assertItemTypeExist(type, options.items.type)
      assertFixedSize(type, options.items.type)

      let offset = options.offset
      let totalBytes = 0
      let result = []

      while(result.length < options.length) {
        let readed = type.read(buffer, { offset })
        result.push(readed.value)
        offset += readed.bytesLength
        totalBytes += readed.bytesLength
      }

      return { value: result, bytesLength: totalBytes }
    },

    write(buffer, values, options) {
      assertBuffer(buffer)
      assertOptions(options)
      assertOffset(options.offset)
      assertArrayValue(values)
      assertItemsOptions(options.items)

      const type = types[options.items.type]
      assertItemTypeExist(type, options.items.type)
      assertFixedSize(type, options.items.type)

      let offset = options.offset

      values.forEach((value) => {
        type.write(buffer, value, { offset })
        offset += type.bytes(value)
      })

      return this.bytes(values, options)
    },

    bytes: (values, options) => {
      assertArrayValue(values)
      assertItemsOptions(options.items)

      const type = types[options.items.type]
      assertItemTypeExist(type, options.items.type)
      assertFixedSize(type, options.items.type)

      return values.length * type.bytes(values)
    },

    length: (values) => {
      assertArrayValue(values)

      return values.length
    },

    fixedSize: false
  }
}

function assertLength(length) {
  assert.number(length, `length must be a number, current length: ${length}`)
  assert.positive(length, `length must be greater than zero, current length: ${length}`)
}

function assertOffset(offset) {
  assert.number(offset, `offset must be a number, current value: ${offset}`)
  assert.positiveOrZero(offset, `offset must be greater or equal to zero, current value: ${offset}`)
}

function assertOptions(options) {
  assert.mapObject(options, 'options is required and must be an object - nor null, nor array -')
}

function assertBuffer(buffer) {
  assert.buffer(buffer, 'buffer must be a Buffer instance')
}

function assertPositiveOrZeroNumberValue(value) {
  assert.number(value, 'value must be a number')
  assert.positiveOrZero(value, 'value must be greater or equal than zero')
}

function assertNumberValue(value) {
  assert.number(value, 'value must be a number')
}

function assertStringValue(value) {
  assert.string(value, 'value must be a number')
}

function assertArrayValue(value) {
  assert.array(value, 'value must be an array')
}

function assertBufferValue(value) {
  assert.buffer(value, 'value must be a buffer')
}

function assertItemTypeExist(type, typeName) {
  assert.exist(type, `item type ${typeName} is not valid type`)
}

function assertItemsOptions(items) {
  assert.mapObject(items, 'items options are required')
}

function assertFixedSize(type, typeName) {
  if (!type.fixedSize) {
    throw new Error(`item type ${typeName} is not supported`)
  }
}

module.exports = types
