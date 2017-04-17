'use strict';

const expect = require('chai').expect;
const dateUtils = require('./date');

describe('date utils', function() {
  const date = new Date(2017, 3, 21, 22, 23, 0, 0);

  describe('#formatUtcIsoDate', function() {
    it('returns a formated date', function() {
      expect(dateUtils.formatUtcIsoDate(date)).to.equal('2017-04-22T01:23:00Z');
    });
  });
});
