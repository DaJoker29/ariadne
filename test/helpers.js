const assert = require('assert');
const helpers = require('../lib/helpers.js');

describe('Helpers', () => {
  describe('calcSplit()', () => {
    it('should prioritize blank lines', () => {
      assert.deepEqual(helpers.CALC_SPLIT('Something\n\nElse\nAnother. Some more.', 38), 9);
    });
    it('then newlines', () => {
      assert.deepEqual(helpers.CALC_SPLIT('Something\nElse\nAnother. Some more.', 38), 14);
    });
    it('then periods', () => {
      assert.deepEqual(helpers.CALC_SPLIT('Something Else Another. Some more.', 32), 22);
    });
    it('then whitespace', () => {
      assert.deepEqual(helpers.CALC_SPLIT('Something Else Another Some more', 32), 27);
    });
    it('then line number', () => {
      assert.deepEqual(helpers.CALC_SPLIT('SomethingElseAnotherSomemore', 20), 20);
    });
  });
});