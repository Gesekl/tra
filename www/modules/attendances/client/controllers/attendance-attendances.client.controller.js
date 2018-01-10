(function () {
  'use strict';

  // Attendances controller
  angular
    .module('attendances')
    .controller('AttendancesController', AttendancesController);

  AttendancesController.$inject = ['AttendancesService','$scope', '$state', '$window', 'Authentication', 'attendanceResolve','BatchesService','SubjectsService','LecturesSubjectsService','StudentsService','toaster'];

  function AttendancesController (AttendancesService,$scope, $state, $window, Authentication, attendance,BatchesService,SubjectsService,LecturesSubjectsService,StudentsService,toaster) {
    var vm = this;

    vm.authentication = Authentication;
    vm.attendance = attendance;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.allLectureSubjects = LecturesSubjectsService.query();
    vm.batches = BatchesService.batches({'path':'lectures'});
    vm.subjects = [];
    vm.subject = {};
    vm.sections = ['A','B','C','D','E'];
    vm.attendanceStatusForMobileView = attendanceStatusForMobileView;
    vm.attendanceStatusForDesktopView = attendanceStatusForDesktopView ;
    vm.students = [];
    vm.attendance.stdAttendance = [];
    vm.attendances = AttendancesService.query();// created By veda for update
    vm.reset = reset;
    vm.mobileView = mobileView;
    vm.desktopView = desktopView;
    vm.updated='-';
    vm.updatedata='null';
   
    
    vm.onSearchOptionChange = ()=>{
      
      if( vm.attendance.batch && vm.attendance.section ){
            
            let search = {"path": "specific","batchId": vm.attendance.batch,"section": vm.attendance.section};
            vm.students = StudentsService.getStudentsForBatchAndSection(search,(res)=>{

            vm.attendanceIsStarted = true;
            vm.attendance.stdAttendance = [];
            vm.students.forEach(function(data,index){
               data.status = 'P';
               vm.attendance.stdAttendance.push(data);
            });
 
            //getting Single and First Object for Attendance Panel 
            vm.attend =  { 
              usn:vm.students[vm.currentStudentIndex].usn,
              name:vm.students[vm.currentStudentIndex].name
            };
        });
      }


      // get created date for update

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
    //Count of Attendance
    vm.currentStudentIndex=0;
    vm.attendanceIsStarted = false;
    vm.attendanceIsCompleted = false;
    vm.desktopViewTable = true;
    vm.mobileViewPanel = false;

 
  function mobileView(){
         vm.mobileViewPanel = true;
         vm.desktopViewTable = false;
         vm.attendance.stdAttendance = [];
         vm.students.forEach(function(data,index){
                  vm.attendance.stdAttendance.push(data);
           });
           console.log(vm.attendance.stdAttendance);
  }


  function desktopView(){
       vm.desktopViewTable = true;
       vm.mobileViewPanel = false;
        vm.attendance.stdAttendance = [];
        vm.students.forEach(function(data,index){
                   data.status = 'P';
                 vm.attendance.stdAttendance.push(data);
          });
         console.log(vm.attendance.stdAttendance);
  }

 

     // Remove existing Attendance
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.attendance.$remove($state.go('attendances.list'));
      }
    }

    
         //Attendance Status Checking
        function attendanceStatusForMobileView(atStatus){
              
                    vm.attendance.stdAttendance[vm.currentStudentIndex].status = atStatus;
             
                    vm.currentStudentIndex++;
                    if(vm.currentStudentIndex <= vm.students.length-1){
                              vm.attend = { 
                                          usn:vm.students[vm.currentStudentIndex].usn,
                                          name:vm.students[vm.currentStudentIndex].name
                                         };
                          
                    }
                    if(vm.currentStudentIndex == vm.students.length){
                       vm.attendanceIsCompleted = true;
                    }
                          
        }

        
      function attendanceStatusForDesktopView(atStatus,stdObjId){
                            
                vm.attendance.stdAttendance.forEach(function(data,index){
                        if(data._id == stdObjId){
                              vm.attendance.stdAttendance[index].status = atStatus;
                          }
                });              
            
                        
      }  

    // Save Attendance
    function save() {
   
      vm.attendance.lecture = Authentication.user._id;

      // TODO: move create/update logic to service
       
      if (vm.attendance._id) {
        vm.attendance.$update(successCallback, errorCallback);
      } else {
            vm.attendance.students = vm.attendance.stdAttendance;
            vm.attendance.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
         toaster.pop('success', "Attendance", "Attendance details saved successfully!!");
        reset();
    
        $state.go('attendances.create', {
          attendanceId: res._id
        });
      }

      function errorCallback(res) {
         toaster.pop('error', "Attendance", "Unable to save attendance Details!!");
        vm.error = res.data.message;
      }
    }
  }
}());
