'use strict'

const dataTypes = require('./data_types')
const assert = require('../assert')
const parseSchema = require('./schema_parser')

module.exports = function encode(schema, values) {
  assert.mapObject(values, 'values must be an object')
  assert.array(schema, 'schema must be an array')

  const parsed = parseSchema(schema)
  let totalLength = 0

  const buffers = parsed.order.reduce((buffers, property) => {
    const descriptor = parsed.properties[property]

    const valueBuffer = write({
      currentDescriptor: descriptor,
      properties: parsed.properties,
      values,
    })

    totalLength += valueBuffer.length

    buffers.push(valueBuffer)

    return buffers
  }, [])

  return Buffer.concat(buffers, totalLength)
}

function write(options) {
  const currentDescriptor = options.currentDescriptor
  const properties = options.properties
  const values = options.values
  const type = dataTypes[currentDescriptor.type]

  const value = getPropertyValue(options)
  const bytes = type.bytes(value, { offset: 0, items: currentDescriptor.items })
  const buffer = new Buffer(bytes)

  try {
    type.write(buffer, value, { offset: 0, items: currentDescriptor.items })
  } catch (err) {
    throw new Error(`Error writing property ${currentDescriptor.property}: ${err.message}`)
  }

  return buffer
}

function getPropertyValue(options) {
  const currentDescriptor = options.currentDescriptor
  const properties = options.properties
  const values = options.values

  const valueFromLengthPropertyName = currentDescriptor.valueFrom &&
    currentDescriptor.valueFrom.length &&
    currentDescriptor.valueFrom.length.property

  if (valueFromLengthPropertyName) {
    const associatedValue = values[valueFromLengthPropertyName]
    const associatedDescriptor = properties[valueFromLengthPropertyName]
    const associatedType = dataTypes[associatedDescriptor.type]

    if (!associatedType) {
      throw new Error(`Type ${associatedDescriptor.type} on property ${valueFromLengthPropertyName}` +
        `associated to length on property ${currentDescriptor.property} does not exist`)
    }

    if (!associatedDescriptor) {
      throw new Error(`Descriptor for property ${valueFromLengthPropertyName}` +
        `associated to length on property ${currentDescriptor.property} does not exist`)
    }

    return associatedType.length(associatedValue, associatedDescriptor)
  } else {
    return values[currentDescriptor.property]
  }
}
