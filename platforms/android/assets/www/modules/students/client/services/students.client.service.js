// Students service used to communicate Students REST endpoints
(function () {
  'use strict';

  angular
    .module('students')
    .factory('StudentsService', StudentsService);

  StudentsService.$inject = ['$resource'];

  function StudentsService($resource) {
    return $resource('api/students/:path/:studentId/:batchId/:section/:mappedUserId', {
      studentId: '@_id',
      batchId: '@_batchId',
      section: '@_section',
      path: '@_path',
      mappedUserId: '@_mappedUserId'
    }, {
      update: {
        method: 'PUT'
      },
      getStudentsForBatch: {
        method: 'GET',
        isArray: true
      },
      bulkUpdate:{
        method: 'POST',
        isArray: true
      },
      getStudentsForBatchAndSection:{
        method: 'GET',
        isArray: true
      }
    });
  }
}());
