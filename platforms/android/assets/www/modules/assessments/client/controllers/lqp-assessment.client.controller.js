(function () {
  'use strict';

  angular
    .module('assessments')
    .controller('lqpAssessmentController', InternalAssessmentController);

  InternalAssessmentController.$inject = ['$scope', '$http','$state', '$window', 'Authentication', 'AssessmentsService', 'BatchesService', 'LecturesSubjectsService','SubjectsService','toaster'];

  function InternalAssessmentController($scope, $http, $state, $window, Authentication, AssessmentsService, BatchesService, LecturesSubjectsService, SubjectsService,toaster )  {
    var vm = this;

    vm.search = { batchId: '', section: '', subjectId: '',ia:'' };
    vm.allLectureSubjects = LecturesSubjectsService.query();
    vm.subjects = [];
    vm.batches = BatchesService.batches({ 'path': 'lectures'});   
    vm.sections = ['A','B','C','D','E','F'];
    vm.ias=[];
    vm.subject = {};
    vm.question=[];
  
    vm.onSubjectChange = ()=>{
      
        SubjectsService.get({ subjectId: vm.search.subjectId }, ( subject )=>{
          vm.subject = subject;
          // ia list for dropdown
          vm.ias=[];
          vm.subject.assessment.forEach(function(obj){
             vm.ias.push(obj.ia);
             vm.question.push(obj);
          })
          
        });
       
    };

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
  }
}());
