'use strict';

describe('Pos E2E Tests:', function () {
  describe('Test Pos page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/pos');
      expect(element.all(by.repeater('po in pos')).count()).toEqual(0);
    });
  });
});
