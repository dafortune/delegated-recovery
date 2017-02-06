'use strict'

exports.number = function number(number, message) {
  if (typeof number !== 'number' || isNaN(number)) {
    throw new Error(message)
  }
}

exports.integer = function integer(number, message) {
  if (Math.floor(number) !== number) {
    throw new Error(message)
  }
}

exports.positive = function positive(number, message) {
  if (number <= 0) {
    throw new Error(message)
  }
}

exports.positiveOrZero = function positiveOrZero(number, message) {
  if (number < 0) {
    throw new Error(message)
  }
}

exports.array = function array(array, message) {
  if (!Array.isArray(array)) {
    throw new Error(message)
  }
}

exports.mapObject = function mapObject(object, message) {
  if (typeof object !== 'object' || object === null || Array.isArray(object)) {
    throw new Error(message)
  }
};

exports.string = function string(string, message) {
  if (typeof string !== 'string') {
    throw new Error(message)
  }
}

exports.buffer = function buffer(buffer, message) {
  if (!Buffer.isBuffer(buffer)) {
    throw new Error(message)
  }
}

exports.notEmpty = function notEmpty(valueWithLength, message) {
  if (valueWithLength.length === 0) {
    throw new Error(message)
  }
}

exports.exist = function exist(value, message) {
  if (!value) {
    throw new Error(message)
  }
}
