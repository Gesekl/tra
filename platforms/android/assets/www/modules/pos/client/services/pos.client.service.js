// Pos service used to communicate Pos REST endpoints
(function () {
  'use strict';

  angular
    .module('pos')
    .factory('PosService', PosService);
    

  PosService.$inject = ['$resource'];

  function PosService($resource) {
    return $resource('api/pos/:path/:poId/:programId', {
      poId: '@_id',
      path: '@_path',
      programId: '@_programId'
    }, {
      update: {
        method: 'PUT'
      },
      getProgramPOs: {
        method: 'GET',
        isArray: true
      }
    });
  }
 
}());
