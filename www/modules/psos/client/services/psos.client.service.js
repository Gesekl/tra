// Psos service used to communicate Psos REST endpoints
(function () {
  'use strict';

  angular
    .module('psos')
    .factory('PsosService', PsosService);

  PsosService.$inject = ['$resource'];

  function PsosService($resource) {
    return $resource('api/psos/:path/:psoId/:programId', {
      psoId: '@_id',
      path: '@_path',
      programId: '@_programId'
    }, {
      update: {
        method: 'PUT'
      },
      getProgramPSOs: {
        method: 'GET',
        isArray: true
      }
    });
  }
}());
