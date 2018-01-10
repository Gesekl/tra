(function () {
  'use strict';

  // Colleges controller
  angular
    .module('colleges')
    .controller('CollegesController', CollegesController);

  CollegesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'collegeResolve'];

  function CollegesController ($scope, $state, $window, Authentication, college) {
    var vm = this;

    vm.authentication = Authentication;
    vm.college = college;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing College
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.college.$remove($state.go('colleges.list'));
      }
    }

    // Save College
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.collegeForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.college._id) {
        vm.college.$update(successCallback, errorCallback);
      } else {
        vm.college.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('colleges.view', {
          collegeId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
