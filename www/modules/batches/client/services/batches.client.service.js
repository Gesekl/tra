// Batches service used to communicate Batches REST endpoints
(function () {
  'use strict';

  angular
    .module('batches')
    .factory('BatchesService', BatchesService);

  BatchesService.$inject = ['$resource'];

  function BatchesService($resource) {
    return $resource('api/batches/:path/:batchId/:section', {
      batchId: '@_id',
      path: '@_path',
      section: '@_section'
    }, {
      update: {
        method: 'PUT'
      },
      batches: {
        method: 'GET',
        isArray: true
      },
      copo: {
        method: 'GET',
        isArray: true
      },
      copso: {
        method: 'GET',
        isArray: true
      }
    });
  }
}());
