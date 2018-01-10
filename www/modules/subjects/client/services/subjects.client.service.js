// Subjects service used to communicate Subjects REST endpoints
(function () {
  'use strict';

  angular
    .module('subjects')
    .factory('SubjectsService', SubjectsService);

  SubjectsService.$inject = ['$resource'];

  function SubjectsService($resource) {
    return $resource('api/subjects/:path/:subjectId/:batchId/:section/:fileId', {
      subjectId: '@_id',
      batchId: '@_batchId',
      section: '@_section',
      fileId:'@_fileId',
      path: '@_path'
    }, {
      update: {
        method: 'PUT'
      }, bulkUpdate:{
          method: 'POST',
          isArray: true
       },
       getSubjectsBySectionandBatch:{
          method: 'GET',
          isArray: true
       },
       fileUpload:{
          method: 'POST',
		 // isArray: true,
          responseType: 'arraybuffer'
       },fileDownload:{
          method: 'GET',
		   //responseType: 'blob'
         // isArray: true
       }
    });
  }
}());
