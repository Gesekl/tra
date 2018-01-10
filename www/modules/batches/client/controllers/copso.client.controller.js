(function () {
  'use strict';

  angular
    .module('batches')
    .controller('COPSOController', COPSOController);

  COPSOController.$inject = ['BatchesService'];

  function COPSOController(BatchesService) {
    var vm = this;

    vm.batches = BatchesService.query();
    vm.sections = ['A','B','C','D','E','F'];
    vm.search = { batchId: '', section: '' };

    vm.fetchCOPSODetails = ()=>{
       if( vm.search.batchId && vm.search.section ){
          vm.copsos = BatchesService.copso({ path: 'copso', batchId:vm.search.batchId, section: vm.search.section });
        }
    };

  }
}());
