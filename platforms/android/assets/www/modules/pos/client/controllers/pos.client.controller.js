(function () {
  'use strict';

  // Pos controller
  angular
    .module('pos')
    .controller('PosController', PosController);

  PosController.$inject = ['$scope', '$state', '$window', 'Authentication', 'poResolve'];

  function PosController ($scope, $state, $window, Authentication, po) {
    var vm = this;

    vm.authentication = Authentication;
    vm.po = po;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Po
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.po.$remove($state.go('pos.list'));
      }
    }

    // Save Po
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.poForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.po._id) {
        vm.po.$update(successCallback, errorCallback);
      } else {
        vm.po.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('pos.list', {
          poId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
