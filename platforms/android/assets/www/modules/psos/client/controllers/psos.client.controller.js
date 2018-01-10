(function () {
  'use strict';

  // Psos controller
  angular
    .module('psos')
    .controller('PsosController', PsosController);

  PsosController.$inject = ['$scope', '$state', '$window', 'Authentication', 'psoResolve'];

  function PsosController ($scope, $state, $window, Authentication, pso) {
    var vm = this;

    vm.authentication = Authentication;
    vm.pso = pso;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Pso
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.pso.$remove($state.go('psos.list'));
      }
    }

    // Save Pso
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.psoForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.pso._id) {
        vm.pso.$update(successCallback, errorCallback);
      } else {
        vm.pso.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('psos.list', {
          psoId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
