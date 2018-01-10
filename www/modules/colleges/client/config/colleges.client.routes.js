(function () {
  'use strict';

  angular
    .module('colleges')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('colleges', {
        abstract: true,
        url: '/colleges',
        template: '<ui-view/>'
      })
      .state('colleges.list', {
        url: '',
        templateUrl: 'modules/colleges/client/views/list-colleges.client.view.html',
        controller: 'CollegesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Colleges List'
        }
      })
      .state('colleges.create', {
        url: '/create',
        templateUrl: 'modules/colleges/client/views/form-college.client.view.html',
        controller: 'CollegesController',
        controllerAs: 'vm',
        resolve: {
          collegeResolve: newCollege
        },
        data: {
          roles: ['super'],
          pageTitle: 'Colleges Create'
        }
      })
      .state('colleges.edit', {
        url: '/:collegeId/edit',
        templateUrl: 'modules/colleges/client/views/form-college.client.view.html',
        controller: 'CollegesController',
        controllerAs: 'vm',
        resolve: {
          collegeResolve: getCollege
        },
        data: {
          roles: ['super'],
          pageTitle: 'Edit College {{ collegeResolve.name }}'
        }
      })
      .state('colleges.view', {
        url: '/:collegeId',
        templateUrl: 'modules/colleges/client/views/view-college.client.view.html',
        controller: 'CollegesController',
        controllerAs: 'vm',
        resolve: {
          collegeResolve: getCollege
        },
        data: {
          pageTitle: 'College {{ collegeResolve.name }}'
        }
      });
  }

  getCollege.$inject = ['$stateParams', 'CollegesService'];

  function getCollege($stateParams, CollegesService) {
    return CollegesService.get({
      collegeId: $stateParams.collegeId
    }).$promise;
  }

  newCollege.$inject = ['CollegesService'];

  function newCollege(CollegesService) {
    return new CollegesService();
  }
}());
