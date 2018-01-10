(function () {
  'use strict';

  // Attendances controller
  angular
    .module('attendances')
    .controller('UpdateAttendancesController', AttendancesController);

  AttendancesController.$inject = ['AttendancesService','$scope', '$state', '$window', 'Authentication', 'attendanceResolve','BatchesService','SubjectsService','LecturesSubjectsService','StudentsService','toaster'];

  function AttendancesController (AttendancesService,$scope, $state, $window, Authentication, attendance,BatchesService,SubjectsService,LecturesSubjectsService,StudentsService,toaster) {
    var vm = this;

    vm.authentication = Authentication;
    vm.attendance = attendance;
    vm.error = null;
    vm.form = {};
    vm.update=update;
    vm.tableview=false;
    vm.allLectureSubjects = LecturesSubjectsService.query();
    vm.batches = BatchesService.batches({'path':'lectures'});
    vm.subjects = [];
    vm.sections = ['A','B','C','D','E'];
    vm.students = [];
    vm.attendance.stdAttendance = [];
    vm.attendances = AttendancesService.query();// created By veda for update
    vm.reset = reset;
    vm.updated='-';
    vm.selectedstu=selectedstu;
    vm.absent=absent;
    vm.present=present;
   vm.buttonstatus=false;
    vm.up='Update';
    vm.get='Get status';
    vm.onSearchOptionChange = ()=>{
      
      if( vm.attendance.batch && vm.attendance.section ){
            
            let search = {"path": "specific","batchId": vm.attendance.batch,"section": vm.attendance.section};
            vm.students = StudentsService.getStudentsForBatchAndSection(search,(res)=>{
            vm.attendanceIsStarted = true;
            vm.students.forEach(function(data,index){
               vm.attendance.stdAttendance.push(data);
            });
        });
      }
    }
 
    function reset(){
              vm.attendance ={};
              attendance = {};
              vm.currentStudentIndex=0;
              vm.students = [];
              vm.attend = {};
              vm.addAttend = {};
              vm.attendance.stdAttendance = [];
              vm.attendanceIsStarted = false;
              vm.attendanceIsCompleted = false;
    } 
       
      // Update Attendance


      function update(){
        if(!vm.buttonstatus){
        vm.buttonstatus=true;
        toaster.pop('success', "Attendance", "Attendance details Get successfully!!");
        }else{
          vm.buttonstatus=false;
          toaster.pop('success', "Attendance", "Attendance details Update successfully!!");
        }
       vm.tableview=true;
vm.updatedata = AttendancesService.updateattend({ 'path':'update', 'recordId' : vm.attendance.studentId._id,'date' : vm.attendance.date.created,'status' :vm.updated});
vm.updatedata.$promise.then( function( data ){
  data.forEach(function(d) {
    vm.updated=d.status;
  })
                   
 });
}
function absent(){
vm.updated='A'
}
function present(){
  vm.updated='P'
}
function selectedstu(d){
  
vm.studentDetails={name:d.firstName,usn:d.usn}
}

   
  }
}());
