(function () {
  'use strict';

  // Lectures controller
  angular
    .module('lectures')
    .controller('LecturesController', LecturesController);

  LecturesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'lectureResolve'];

  function LecturesController ($scope, $state, $window, Authentication, lecture) {
    var vm = this;

    vm.authentication = Authentication;
    vm.lecture = lecture;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    vm.qualification=['B.E/B.Tech','M.Tech','P.Hd'];

    vm.lecture.name = null;
 
    vm.bindName = bindName;
   
    vm.lecture.firstname = '';

    vm.lecture.lastname = '';
    
    function bindName(){
       vm.lecture.name = vm.lecture.lastName + ', ' + vm.lecture.firstName;
    }


    // Remove existing Lecture
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.lecture.$remove($state.go('lectures.list'));
      }
    }

    // Save Lecture
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.lectureForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.lecture._id) {
        vm.lecture.$update(successCallback, errorCallback);
      } else {
        vm.lecture.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('lectures.list', {
          lectureId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
