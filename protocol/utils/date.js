'use strict';

/**
 * @param {Date} dateObject
 */
exports.formatUtcIsoDate = function formatUtcIsoDate(dateObject) {
  const year = zeroPad(dateObject.getUTCFullYear(), 4);
  const month = zeroPad(dateObject.getUTCMonth() + 1, 2)
  const date = zeroPad(dateObject.getUTCDate(), 2)
  const hours = zeroPad(dateObject.getUTCHours(), 2);
  const minutes = zeroPad(dateObject.getUTCMinutes(), 2);
  const seconds = zeroPad(dateObject.getUTCSeconds(), 2);

  return `${year}-${month}-${date}T${hours}:${minutes}:${seconds}Z`;
}

function zeroPad(number, size) {
  const padLength = size - number.toString().length;
  let pad = '';

  for (let i = 0; i < padLength; i += 1) {
    pad += '0';
  }

  return pad.toString() + number.toString();
}
