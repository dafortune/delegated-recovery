'use strict'

const assert = require('../assert')
const dataTypes = require('./data_types')
const validDataTypeNames = Object.keys(dataTypes)

/**
 * Parses an schema
 *
 * Example:
 *
 * [
 *   {
 *     property: 'name_length',
 *     type: 'uint8'
 *   },
 *
 *   {
 *     property: 'name',
 *     type: 'string',
 *     length: { property: 'name_length' }
 *   },
 *
 *   {
 *     property: 'shelves',
 *     type: 'array',
 *     items: { type: 'uint8' }
 *     length: { value: 5 }
 *   },
 *
 *   {
 *     property: 'branches',
 *     type: 'array',
 *     items: { type: 'uint8' }
 *     length: { property: 'branches_length' }
 *   },
 *
 *   {
 *     property: 'size',
 *     type: 'uint8'
 *   }
 * ]
 */

module.exports = function parseSchema(schema) {
  const result = schema.reduce((current, descriptor, index) => {
    assert.exist(descriptor.property, `Property not defined for schema on index ${index}`)
    assert.exist(descriptor.type, `Type not defined on schema for property ${descriptor.property}`)

    if (!dataTypes[descriptor.type]) {
      throw new Error(`Invalid type defined on schema for property ${descriptor.property}. Expected types ${validDataTypeNames.join(', ')}.`)
    }

    current.properties[descriptor.property] = Object.assign(current.properties[descriptor.property] || {}, descriptor)

    if (descriptor.length && descriptor.length.property) {
      current.properties[descriptor.length.property] = current.properties[descriptor.length.property] || {}
      current.properties[descriptor.length.property].valueFrom = { length: { property: descriptor.property } }
      current.associatedProperties.push({ property: descriptor.length.property, associatedProperty: descriptor.property })
    }

    current.order.push(descriptor.property)

    return current
  }, { order: [], properties: Object.create(null), associatedProperties: [] })

  result.associatedProperties.forEach((association) => {
    assert.exist(result.properties[association.property] && result.properties[association.property].property,
      `Missing schema for property ${association.property} associated with ${association.associatedProperty}`)

    if (result.order.indexOf(association.property) > result.order.indexOf(association.associatedProperty)) {
      throw new Error(`length property (${association.property}) for schema ${association.associatedProperty} must be before the actual property.`)
    }
  });

  return { order: result.order, properties: result.properties };
}
