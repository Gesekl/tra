(function () {
  'use strict';

  angular
    .module('assessments')
    .controller('StudentAssessmentController', StudentAssessmentController);

  StudentAssessmentController.$inject = ['AssessmentsService', 'studentResolve'];

  function StudentAssessmentController(AssessmentsService, studentResolve) {
    var vm = this;    
    vm.assessments = AssessmentsService.getStudentAssessment({ path: 'student', studentId: studentResolve._id });
    // vm.assessmentlist = [];
    vm.getSubject = function(d) {
      vm.sub={};
      vm.sub.name=d.name;
      vm.sub.scode=d.subjectCode;
      vm.sub.tot=d.totalscore;
      vm.sub.IAs=[];
     d.assesmentlist.forEach(function(IA){
        vm.sub.IAs.push(IA);
     })
    }

  }
}());
