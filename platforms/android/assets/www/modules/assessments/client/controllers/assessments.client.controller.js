(function () {
  'use strict';

  // Assessments controller
  angular
    .module('assessments')
    .controller('AssessmentsController', AssessmentsController);

  AssessmentsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'assessmentResolve'];

  function AssessmentsController ($scope, $state, $window, Authentication, assessment) {
    var vm = this;

    vm.authentication = Authentication;
    vm.assessment = assessment;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Assessment
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.assessment.$remove($state.go('assessments.list'));
      }
    }

    // Save Assessment
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.assessmentForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.assessment._id) {
        vm.assessment.$update(successCallback, errorCallback);
      } else {
        vm.assessment.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('assessments.view', {
          assessmentId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
