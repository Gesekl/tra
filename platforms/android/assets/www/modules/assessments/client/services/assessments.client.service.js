// Assessments service used to communicate Assessments REST endpoints
(function () {
  'use strict';

  angular
    .module('assessments')
    .factory('AssessmentsService', AssessmentsService);

  AssessmentsService.$inject = ['$resource'];

  function AssessmentsService($resource) {
    return $resource('api/assessments/:path/:assessmentId/:batchId/:section/:subjectId/:studentId', {
      assessmentId: '@_id',
      batchId: '@_batchId',
      section: '@_section',
      subjectId: '@_subjectId',
      path: '@_path',
      studentId: '@_studentId'
    }, {
      update: {
        method: 'PUT'
      }, fetchAssessments: {
          method: 'GET',
          isArray: true
      }, updateAssessments: {
          method: 'PUT',
          isArray: true
      }, getStudentAssessment: {
         method: 'GET',
         isArray: true
      },getAssessmentsForStudent: {
         method: 'GET',
         isArray: true
      }
    });
  }
}());
