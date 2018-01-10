(function () {
  'use strict';

  angular
    .module('lectures')
    .controller('LecturesSubjectsController', LecturesSubjectsController);

  LecturesSubjectsController.$inject = ['LecturesSubjectsService', '$http', 'BatchesService'];

  function LecturesSubjectsController(LecturesSubjectsService, $http, BatchesService) {
    var vm = this;
    vm.onChangeOptions = onChangeOptions;
    vm.batches = BatchesService.batches({'path':'lectures'});
    vm.subjects = [];

    function onChangeOptions(){    
          vm.subjects = LecturesSubjectsService.query();
          vm.subjects.$promise.then(function( result ){
                       vm.subjects = result.filter(function( data ){
                          return data.batch.name == vm.search.batch;
                        });
          });
         
     }
    
  }
}());
