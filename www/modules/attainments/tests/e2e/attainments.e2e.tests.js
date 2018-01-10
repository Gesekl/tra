'use strict';

describe('Attainments E2E Tests:', function () {
  describe('Test Attainments page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/attainments');
      expect(element.all(by.repeater('attainment in attainments')).count()).toEqual(0);
    });
  });
});
