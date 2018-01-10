(function () {
  'use strict';

  angular
    .module('pos')
    .controller('PosListController', PosListController);

  PosListController.$inject = ['PosService'];

  function PosListController(PosService) {
    var vm = this;

    vm.pos = PosService.query();
  }
}());
