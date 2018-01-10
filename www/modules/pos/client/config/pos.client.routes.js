(function () {
  'use strict';

  angular
    .module('pos')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('pos', {
        abstract: true,
        url: '/pos',
        template: '<ui-view/>'
      })
      .state('pos.list', {
        url: '',
        templateUrl: 'modules/pos/client/views/list-pos.client.view.html',
        controller: 'PosListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Pos List'
        }
      })
      .state('pos.create', {
        url: '/create',
        templateUrl: 'modules/pos/client/views/form-po.client.view.html',
        controller: 'PosController',
        controllerAs: 'vm',
        resolve: {
          poResolve: newPo
        },
        data: {
          roles: ['hod'],
          pageTitle: 'Pos Create'
        }
      })
      .state('pos.edit', {
        url: '/:poId/edit',
        templateUrl: 'modules/pos/client/views/form-po.client.view.html',
        controller: 'PosController',
        controllerAs: 'vm',
        resolve: {
          poResolve: getPo
        },
        data: {
          roles: ['hod'],
          pageTitle: 'Edit Po {{ poResolve.name }}'
        }
      })
      .state('pos.view', {
        url: '/:poId',
        templateUrl: 'modules/pos/client/views/view-po.client.view.html',
        controller: 'PosController',
        controllerAs: 'vm',
        resolve: {
          poResolve: getPo
        },
        data: {
          pageTitle: 'Po {{ poResolve.name }}'
        }
      });
  }

  getPo.$inject = ['$stateParams', 'PosService'];

  function getPo($stateParams, PosService) {
    return PosService.get({
      poId: $stateParams.poId
    }).$promise;
  }

  newPo.$inject = ['PosService'];

  function newPo(PosService) {
    return new PosService();
  }
}());
