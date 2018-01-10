// Attendances service used to communicate Attendances REST endpoints
(function () {
  'use strict';

  angular
    .module('attendances')
    .factory('AttendancesService', AttendancesService);

  AttendancesService.$inject = ['$resource'];

  function AttendancesService($resource) {
    return $resource('api/attendances/:path/:attendanceId/:batchId/:section/:userId/:subjectId/:studentId/:recordId/:date/:status', {
      attendanceId: '@_id',
      batchId: '@_batchId',
      section: '@_section',
      subjectId: '@_subjectId',
      studentId:'@_studentId',
      userId: '@_userId',
      path: '@_path'
    }, {
      update: {
        method: 'PUT'
      },
      getStudents: {
         method: 'GET',
         isArray:true
      },
      getAttendanceByLectureAndSection: {
         method: 'GET',
        // isArray: true
      },
      getstudentattendance:{
        method:'GET',
        isArray: true
      },
      updateattend:{
        method:'GET',
        isArray: true
      }


    });
  }
}());
