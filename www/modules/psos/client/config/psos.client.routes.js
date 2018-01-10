// (function () {
//   'use strict';

//   angular
//     .module('psos')
//     .config(routeConfig);

//   routeConfig.$inject = ['$stateProvider'];

//   function routeConfig($stateProvider) {
//     $stateProvider
//       .state('psos', {
//         abstract: true,
//         url: '/psos',
//         template: '<ui-view/>'
//       })
//       .state('psos.list', {
//         url: '',
//         templateUrl: 'modules/psos/client/views/list-psos.client.view.html',
//         controller: 'PsosListController',
//         controllerAs: 'vm',
//         data: {
//           pageTitle: 'Psos List'
//         }
//       })
//       .state('psos.create', {
//         url: '/create',
//         templateUrl: 'modules/psos/client/views/form-pso.client.view.html',
//         controller: 'PsosController',
//         controllerAs: 'vm',
//         resolve: {
//           psoResolve: newPso
//         },
//         data: {
//           roles: ['hod'],
//           pageTitle: 'Psos Create'
//         }
//       })
//       .state('psos.edit', {
//         url: '/:psoId/edit',
//         templateUrl: 'modules/psos/client/views/form-pso.client.view.html',
//         controller: 'PsosController',
//         controllerAs: 'vm',
//         resolve: {
//           psoResolve: getPso
//         },
//         data: {
//           roles: ['hod'],
//           pageTitle: 'Edit Pso {{ psoResolve.name }}'
//         }
//       })
//       .state('psos.view', {
//         url: '/:psoId',
//         templateUrl: 'modules/psos/client/views/view-pso.client.view.html',
//         controller: 'PsosController',
//         controllerAs: 'vm',
//         resolve: {
//           psoResolve: getPso
//         },
//         data: {
//           pageTitle: 'Pso {{ psoResolve.name }}'
//         }
//       });
//   }

//   getPso.$inject = ['$stateParams', 'PsosService'];

//   function getPso($stateParams, PsosService) {
//     return PsosService.get({
//       psoId: $stateParams.psoId
//     }).$promise;
//   }

//   newPso.$inject = ['PsosService'];

//   function newPso(PsosService) {
//     return new PsosService();
//   }
// }());
