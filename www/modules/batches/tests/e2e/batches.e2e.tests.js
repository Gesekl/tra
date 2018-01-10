'use strict';

describe('Batches E2E Tests:', function () {
  describe('Test Batches page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/batches');
      expect(element.all(by.repeater('batch in batches')).count()).toEqual(0);
    });
  });
});
