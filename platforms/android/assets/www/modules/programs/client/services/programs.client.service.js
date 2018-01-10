// Programs service used to communicate Programs REST endpoints
(function () {
  'use strict';

  angular
    .module('programs')
    .factory('ProgramsService', ProgramsService);

  ProgramsService.$inject = ['$resource'];

  function ProgramsService($resource) {
    return $resource('api/programs/:path/:programId/:mappedUserId', {
      programId: '@_id',
      path: '@_path',
      mappedUserId: '@_mappedUserId'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
