(function () {
  'use strict';

  angular
    .module('batches')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('batches', {
        abstract: true,
        url: '/batches',
        template: '<ui-view/>'
      })
      .state('batches.list', {
        url: '',
        templateUrl: 'modules/batches/client/views/list-batches.client.view.html',
        controller: 'BatchesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Batches List'
        }
      })
      .state('batches.create', {
        url: '/create',
        templateUrl: 'modules/batches/client/views/form-batch.client.view.html',
        controller: 'BatchesController',
        controllerAs: 'vm',
        resolve: {
          batchResolve: newBatch
        },
        data: {
          roles: ['hod','admin'],
          pageTitle: 'Batches Create'
        }
      })
      .state('batches.edit', {
        url: '/:batchId/edit',
        templateUrl: 'modules/batches/client/views/form-batch.client.view.html',
        controller: 'BatchesController',
        controllerAs: 'vm',
        resolve: {
          batchResolve: getBatch
        },
        data: {
          roles: ['hod','admin'],
          pageTitle: 'Edit Batch {{ batchResolve.name }}'
        }
      })
      .state('batches.co', {
        url: '/co',
        templateUrl: 'modules/batches/client/views/course-outcome.client.view.html',
        controller: 'CourseOutcomeController',
        controllerAs: 'vm',       
        data: {
          roles: ['hod','admin'],
          pageTitle: 'Course Outcome'
        },
        resolve: {
          programResolve: getProgram
        }
      })     
      .state('batches.view', {
        url: '/:batchId',
        templateUrl: 'modules/batches/client/views/view-batch.client.view.html',
        controller: 'BatchesController',
        controllerAs: 'vm',
        resolve: {
          batchResolve: getBatch
        },
        data: {
          pageTitle: 'Batch {{ batchResolve.name }}'
        }
      });
  }

  getLecture.$inject = ['Authentication', 'LecturesService'];

  function getLecture(Authentication, LecturesService){
      return LecturesService.get({ path: 'mappedUserId', mappedUserId: Authentication.user._id }).$promise;
  }

  getProgram.$inject = ['Authentication', 'ProgramsService'];

  function getProgram(Authentication, ProgramsService){
      return ProgramsService.get({ path: 'mappedUserId', mappedUserId: Authentication.user._id }).$promise;
  }

  getBatch.$inject = ['$stateParams', 'BatchesService'];

  function getBatch($stateParams, BatchesService) {
    return BatchesService.get({
      batchId: $stateParams.batchId
    }).$promise;
  }

  newBatch.$inject = ['BatchesService'];

  function newBatch(BatchesService) {
    return new BatchesService();
  }
}());
