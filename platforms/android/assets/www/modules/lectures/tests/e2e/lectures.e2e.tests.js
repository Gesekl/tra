'use strict';

describe('Lectures E2E Tests:', function () {
  describe('Test Lectures page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/lectures');
      expect(element.all(by.repeater('lecture in lectures')).count()).toEqual(0);
    });
  });
});
