(function () {
  'use strict';

  angular
    .module('assessments')
    .controller('sqpAssessmentController', StudentAssessmentController);

  StudentAssessmentController.$inject = ['AssessmentsService','SubjectsService', 'studentResolve'];

  function StudentAssessmentController(AssessmentsService,SubjectsService, studentResolve) {
    var vm = this;    
   vm.question=[];
    vm.assessments = AssessmentsService.getStudentAssessment({ path: 'student', studentId: studentResolve._id });
   
    vm.getSubject = function() {
         SubjectsService.get({ subjectId: '59951a0c0aa5e4100e114883' }, ( subject )=>{
          vm.subject = subject;
          vm.subject.assessment.forEach(function(obj){
             vm.question.push(obj);
          })
         
        });
    }
     vm.getQP = function(qp) {
         alert('alert'+JSON.stringify(qp));
    }

  }
}());
