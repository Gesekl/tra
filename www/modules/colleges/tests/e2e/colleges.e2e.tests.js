'use strict';

describe('Colleges E2E Tests:', function () {
  describe('Test Colleges page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/colleges');
      expect(element.all(by.repeater('college in colleges')).count()).toEqual(0);
    });
  });
});
