// Attainments service used to communicate Attainments REST endpoints
(function () {
  'use strict';

  angular
    .module('attainments')
    .factory('AttainmentsService', AttainmentsService);

  AttainmentsService.$inject = ['$resource'];

  function AttainmentsService($resource) {
    return $resource('api/attainments/:attainmentId/:path/:batchId/:section/:mappedUserId/:subjectId', {
      attainmentId: '@_id',
      path: '@_path',
      batchId: '@_batchId',
      section: '@_section',
      mappedUserId: '@_mappedUserId',
      subjectId: '@_subjectId'
    }, {
      update: {
        method: 'PUT'
      }, getAllSubAttainmentOfLecture: {
          method: 'GET',
          isArray: true
      }, getAllAttainmentForBatch: {
          method: 'GET',
          isArray: true
      }
    });
  }
}());
