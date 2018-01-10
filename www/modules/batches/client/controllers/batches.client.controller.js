(function () {
  'use strict';

  // Batches controller
  angular
    .module('batches')
    .controller('BatchesController', BatchesController);

  BatchesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'batchResolve','$filter'];

  function BatchesController ($scope, $state, $window, Authentication, batch, $filter) {
    var vm = this;

    vm.authentication = Authentication;
    vm.batch = batch;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.systems = ['Credit', 'Standard'];
   
     vm.batch.sdate = new Date(vm.batch.sdate);
     vm.batch.edate = new Date(vm.batch.edate);
    // Remove existing Batch
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.batch.$remove($state.go('batches.list'));
      }
    }

    // Save Batch
    function save(isValid) {
       if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.batchForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.batch._id) {
              vm.batch.$update(successCallback, errorCallback);
      } else {
            //Converting UTC format to System Local Format
            var sdate = vm.batch.sdate;
            var edate = vm.batch.edate;
            vm.batch.sdate = new Date(Date.UTC(sdate.getFullYear(), sdate.getMonth(), sdate.getDate()));
            vm.batch.edate = new Date(Date.UTC(edate.getFullYear(), edate.getMonth(), edate.getDate()));
            vm.batch.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('batches.list', {
          batchId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
