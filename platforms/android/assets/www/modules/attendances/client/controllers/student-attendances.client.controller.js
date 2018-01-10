(function () {
  'use strict';

  angular
    .module('attendances')
    .controller('StuAttendancesListController', StuAttendancesListController);

  StuAttendancesListController.$inject = ['AttendancesService','BatchesService','studentResolve'];

  function StuAttendancesListController(AttendancesService,BatchesService,studentResolve) {
     var vm = this;
         vm.attendances = AttendancesService.getstudentattendance({ path: 'studentsummary', studentId: studentResolve._id });
    


     
    }
}());
