'use strict'

const dataTypes = require('./data_types')
const assert = require('../assert')
const parseSchema = require('./schema_parser')

module.exports = function decode(schema, sequence) {
  assert.buffer(sequence, 'sequence must be a buffer')
  assert.array(schema, 'schema must be an array')

  const parsed = parseSchema(schema)

  let currentOffset = 0
  return parsed.order.reduce((result, property) => {
    const descriptor = parsed.properties[property]

    const readResult = read({
      offset: currentOffset,
      currentDescriptor: descriptor,
      properties: parsed.properties,
      sequence,
      partialResult: result
    })

    result[property] = readResult.value;
    currentOffset += readResult.bytesLength;

    return result
  }, {})
}

function read(options) {
  const offset = options.offset;
  const currentDescriptor = options.currentDescriptor
  const properties = options.properties
  const sequence = options.sequence
  const partialResult = options.partialResult

  const type = dataTypes[currentDescriptor.type]

  const length = getLength(type, currentDescriptor, partialResult)

  try {
    const readed = type.read(sequence, { offset, length, items: currentDescriptor.items })

    return { value: readed.value, bytesLength: readed.bytesLength }
  } catch (err) {
    throw new Error(`Error reading property ${currentDescriptor.property}: ${err.message}`)
  }
}

function getLength(type, currentDescriptor, partialResult) {
  if (type.fixedSize) {
    return;
  }

  assert.mapObject(currentDescriptor.length, `length is required on schema for property ${currentDescriptor.property}`)

  if (typeof currentDescriptor.length.value === 'number' &&
    !isNaN(currentDescriptor.length.value)) {
    return currentDescriptor.length.value
  }

  assert.string(currentDescriptor.length.property, `value or property is required ` +
  `for property 'length' on schema ${currentDescriptor.property}`)

  const length = partialResult[currentDescriptor.length.property];

  assert.integer(length, `The value of the related property ${currentDescriptor.length.property} ` +
  `is not a valid length: expected integer`)
  assert.positiveOrZero(length, `The value of the related property ${currentDescriptor.length.property} ` +
  `is not a valid length: expected positive or zero`)

  return length
}
