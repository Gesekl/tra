'use strict';

describe('Psos E2E Tests:', function () {
  describe('Test Psos page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/psos');
      expect(element.all(by.repeater('pso in psos')).count()).toEqual(0);
    });
  });
});
