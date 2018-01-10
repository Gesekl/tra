(function () {
  'use strict';

  angular
    .module('assessments')
    .controller('AssessmentsListController', AssessmentsListController);

  AssessmentsListController.$inject = ['$scope', '$http','$state', '$window', 'Authentication', 'AssessmentsService', 'BatchesService', 'LecturesSubjectsService','SubjectsService'];

  function AssessmentsListController($scope, $http, $state, $window, Authentication, AssessmentsService, BatchesService, LecturesSubjectsService, SubjectsService) {
    var vm = this;

 vm.search = { batchId: '', section: '', subjectId: '',ia:'' };
    vm.allLectureSubjects = LecturesSubjectsService.query();
    vm.subjects = [];
    vm.batches = BatchesService.batches({ 'path': 'lectures'});   
    vm.sections = ['A','B','C','D','E','F'];
    vm.iash=[];
    vm.allassessment=[];
    
 vm.onSectionChange = ()=>{
       vm.search = Object.assign({}, vm.search, { subjectId: '' });
       vm.subjects = vm.allLectureSubjects.filter((sub)=>{
         return vm.search.batchId === sub.batch._id && vm.search.section === sub.section;
       });
    };

    vm.onBatchChange = ()=>{
     
       vm.search = Object.assign({}, vm.search, { section: '', subjectId: '' });
       vm.subjects = [];
    };

 vm.filterAssessmentByStudent = ( item )=>{ 
  console.log('iiiiii'+JSON.stringify(item));       
       // return !vm.studentFilter || ( item.student.usn.toLowerCase().indexOf( vm.studentFilter.toLowerCase() ) > -1 || item.student.name.toLowerCase().indexOf( vm.studentFilter.toLowerCase() ) > -1 );
    };

 vm.onSubjectChange = ()=>{
    vm.nodata;
      //created By veda assessment details fo all students
    vm.allassessment=AssessmentsService.getAssessmentsForStudent({ 'path': 'allstudent',batchId:vm.search.batchId,section:vm.search.section,subjectId:vm.search.subjectId});
     if(vm.allassessment.length>=0){      
       vm.allassessment.$promise.then(function( result ){
         result[0].assesslist.forEach(function(obj1){
               vm.iash.push(obj1.ia);
               })     
         });   
          vm.nodata=1;
     }else
     {
       vm.nodata=0;
     }
    };
  }
}());
