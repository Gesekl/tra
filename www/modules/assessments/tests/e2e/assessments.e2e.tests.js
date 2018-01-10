'use strict';

describe('Assessments E2E Tests:', function () {
  describe('Test Assessments page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/assessments');
      expect(element.all(by.repeater('assessment in assessments')).count()).toEqual(0);
    });
  });
});
