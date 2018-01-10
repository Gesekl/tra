(function () {
  'use strict';

  angular
    .module('psos')
    .controller('PsosListController', PsosListController);

  PsosListController.$inject = ['PsosService'];

  function PsosListController(PsosService) {
    var vm = this;

    vm.psos = PsosService.query();
  }
}());
