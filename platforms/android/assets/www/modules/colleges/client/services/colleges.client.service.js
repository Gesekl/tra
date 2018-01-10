// Colleges service used to communicate Colleges REST endpoints
(function () {
  'use strict';

  angular
    .module('colleges')
    .factory('CollegesService', CollegesService);

  CollegesService.$inject = ['$resource'];

  function CollegesService($resource) {
    return $resource('api/colleges/:collegeId', {
      collegeId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
