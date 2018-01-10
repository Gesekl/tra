(function () {
  'use strict';

  // Students controller
  angular
    .module('students')
    .controller('StudentsController', StudentsController);

  StudentsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'studentResolve', 'BatchesService' ];

  function StudentsController ($scope, $state, $window, Authentication, student,BatchesService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.student = student;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.batches = BatchesService.query();
    vm.sections = ['A','B','C','D','E','F'];

    // Remove existing Student
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.student.$remove($state.go('students.list'));
      }
    }


    // Save Student
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.studentForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.student._id) {
        vm.student.$update(successCallback, errorCallback);
      } else {
        vm.student.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('students.list', {
          studentId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
