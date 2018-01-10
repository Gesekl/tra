(function () {
  'use strict';

  // Subjects controller
  angular
    .module('subjects')
    .controller('SubjectConfigController', SubjectConfigController);

  SubjectConfigController.$inject = ['$scope', '$state', '$window', 'Authentication', 'subjectResolve','BatchesService','LecturesService', 'PosService', 'PsosService'];

  function SubjectConfigController ($scope, $state, $window, Authentication, subjectResolve, BatchesService, LecturesService, PosService, PsosService ) {
    var vm = this;

    vm.authentication = Authentication;
    vm.subject = subjectResolve;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.saveConfigDetails = saveConfigDetails;
    //vm.batches = BatchesService.query();
    //vm.lectures = LecturesService.query();
    vm.sections = ['A','B','C','D','E','F'];
    vm.semesters = [1,2,3,4,5,6,7,8];
    vm.aggregateOfPOs = aggregateOfPOs;
    vm.aggregateOfPSOs = aggregateOfPSOs;
    vm.calculateExternalPct = calculateExternalPct;
    vm.posList = ['PO1','PO2','PO3','PO4','PO5','PO6','PO7','PO8','PO9','PO10','PO11','PO12'];
    vm.psosList = ['PSO1','PSO2','PSO3','PSO4','PSO5','PSO6'];
    vm.pos = {};
    vm.psos = {};

    vm.addNewCO = function(){
      vm.subject.cos.push({
          name: vm.subject.name + '-' + vm.subject.subjectCode + '-' + ( vm.subject.cos.length + 1 ),
          code: vm.subject.subjectCode + "." + ( vm.subject.cos.length + 1 ),
          description: "",
          pos: {},
          psos: {}
      });
    };

    vm.validateRange = (field, obj )=>{
      if( obj[field] > 3 || obj[field] < 1 ){
        obj[field] = "";
      }
    };

    vm.validPctRange = (field, obj )=> {
      if( obj[field] > 100 || obj[field] < 0 ){
        obj[field] = 0;
      }
    };

    function calculateExternalPct(){
      vm.validPctRange( 'ia', vm.subject.attainment.weightage );
      if( vm.subject.attainment.weightage.ia ){
          vm.subject.attainment.weightage.ea = ( 100 - vm.subject.attainment.weightage.ia );
      }
    }

    // aggregate
    function aggregateOfPOs(field){
        var total = 0;
        vm.subject.cos.forEach( (co, index)=>{
            if( co.pos[field]){
              total = total + parseInt( co.pos[field]);
            }
        });
        return ( total / vm.subject.cos.length).toFixed(3);
    }

    function aggregateOfPSOs(field){
        var total = 0;
        vm.subject.cos.forEach((co,index)=>{
            if( co.psos[field]){
              total = total + parseInt( co.psos[field]);
            }
        });
        return ( total / vm.subject.cos.length ).toFixed(3);
    }

    // Remove existing Subject
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.subject.$remove($state.go('subjects.list'));
      }
    }

        // Save Subject
    function saveConfigDetails(isValid) {
      
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.subjectForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.subject._id) {
        
        vm.subject.$update(successCallback, errorCallback);
      } else {
        vm.subject.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('lectures.mysubjects', {
          subjectId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

    // Save Subject
    function save(isValid) {
      
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.subjectForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.subject._id) {        
        vm.subject.$update(successCallback, errorCallback);
      } else {
        vm.subject.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('subjects.list', {
          subjectId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

    init();

    function init(){

      if( subjectResolve.program ){
          PosService.getProgramPOs({
             path: "program", 
             programId: subjectResolve.program
          }, (poList)=>{
              poList.forEach((po)=>{                
                vm.pos[po.name] = po.description;
              });
          }, (err)=>{
              alert("Unable to get PO List");
          });

          PsosService.getProgramPSOs({
             path: "program", 
             programId: subjectResolve.program
          },(psoList)=>{              
              psoList.forEach((pso)=>{                
                vm.psos[pso.name] = pso.description;
              });
          }, (err)=>{
              alert("Unable to get PSO List");
          });         
      }
    }
  }
}());
