(function () {
  'use strict';

  angular
    .module('batches')
    .controller('COPOController', COPOController);

  COPOController.$inject = ['$scope','BatchesService'];

  function COPOController($scope, BatchesService) {
    var vm = this;

    vm.batches = BatchesService.query();
    vm.sections = ['A','B','C','D','E','F'];
    vm.search = { batchId: '', section:''};
    vm.copos = [];


    vm.fetchCOPODetails = ()=>{
        if( vm.search.batchId && vm.search.section ){
          vm.copos = BatchesService.copo({ path: 'copo', batchId:vm.search.batchId, section: vm.search.section });
        }
    };
 
  }
}());
