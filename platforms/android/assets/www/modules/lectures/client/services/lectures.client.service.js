// Lectures service used to communicate Lectures REST endpoints
(function () {
  'use strict';

  angular
    .module('lectures')
    .factory('LecturesService', LecturesService);

  LecturesService.$inject = ['$resource'];

  function LecturesService($resource) {
    return $resource('api/lectures/:path/:lectureId/:mappedUserId', {
      lectureId: '@_id',
      path: '@_path',
      mappedUserId: '@_mappedUserId'
    }, {
      update: {
        method: 'PUT'
      }, bulkUpdate:{
         method: 'POST',
         isArray: true
       }
    });
  }
}());
