(function () {
  'use strict';

  angular
    .module('attendances')
    .controller('AttendancesListController', AttendancesListController);

  AttendancesListController.$inject = ['AttendancesService','BatchesService','Authentication','LecturesSubjectsService','StudentsService','SubjectsService'];

  function AttendancesListController(AttendancesService,BatchesService,Authentication,LecturesSubjectsService,StudentsService,SubjectsService) {
    var vm = this;
    vm.authentication = Authentication;
    vm.onBatchAndSectionChange = onBatchAndSectionChange;
    vm.onSemisterChange = onSemisterChange;
    vm.studentsList = [];
    vm.attendanceSummary = [];
    vm.allSubjects = [];
    vm.subjectsBySemister = [];

     
    //summary of attendence
    vm.batches = BatchesService.batches({'path':'lectures'});
    vm.sections = ['A','B','C','D','E'];
    vm.semisters = [ 1 , 2 , 3 , 4 , 5 , 6 , 7 , 8 ];
    vm.attendances = AttendancesService.query();
   
   vm.clearBatchandSection = clearBatchandSection;

    function clearBatchandSection(batch){
        if(batch=='Batch'){
          vm.attendance.section = "";
          vm.attendance.semister = "";
        }
    }


    function onBatchAndSectionChange(){
         vm.attendance.semister = "";
         vm.studentsList =  StudentsService.getStudentsForBatchAndSection({ path :'specific', 'batchId': vm.attendance.batch, 'section': vm.attendance.section });
         vm.allSubjects =  LecturesSubjectsService.query();
         vm.attendanceSummary = AttendancesService.getAttendanceByLectureAndSection({ 'path':'summary', 'userId' : Authentication.user._id,'batchId' : vm.attendance.batch,'section' : vm.attendance.section});
        // vm.studentsList.forEach(function(stu){
        //  vm.subjectsBySemister.forEach(function(sub){
        //     console.log('res'+vm.attendanceSummary[stu._id][sub._id].pCount)
        //   })
        // })
         
        console.log(vm.studentsList);
       
    }
 

    function onSemisterChange(){

         vm.subjectsBySemister = vm.allSubjects.filter(function(obj){

              return obj.semester==vm.attendance.semister;
          });
          
//           Highcharts.chart('container', {
//     chart: {
//         plotBackgroundColor: null,
//         plotBorderWidth: null,
//         plotShadow: false,
//         type: 'pie'
//     },
//     title: {
//         text: 'Attendances summary'
//     },
//     tooltip: {
//         pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
//     },
//     plotOptions: {
//         pie: {
//             allowPointSelect: true,
//             cursor: 'pointer',
//             dataLabels: {
//                 enabled: true,
//                 format: '<b>{point.name}</b>: {point.percentage:.1f} %',
//                 style: {
//                     color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
//                 }
//             }
//         }
//     },
//     series: [{
//         name: 'Attendances',
//         colorByPoint: true,
//         data: [{
//             name: 'Present',
//             y: 50
//         }, {
//             name: 'Absent',
//             y: 50,
//             sliced: true,
//             selected: true
//         }]
//     }]
// });

     }
  

     
    }
}());
