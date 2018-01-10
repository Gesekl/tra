// Lectures Subject service used to communicate Lectures REST endpoints
(function () {
  'use strict';

  angular
    .module('lectures')
    .factory('LecturesSubjectsService', LecturesSubjectsService);

  LecturesSubjectsService.$inject = ['$resource'];

  function LecturesSubjectsService($resource) {
    return $resource('api/lecturessubjects', {       
    }, {      
    });
  }
}());
