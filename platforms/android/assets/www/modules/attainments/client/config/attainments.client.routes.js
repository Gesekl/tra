(function () {
  'use strict';

  angular
    .module('attainments')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('attainments', {
        abstract: true,
        url: '/attainments',
        template: '<ui-view/>'
      })
      .state('attainments.mysubjectattainment', {
        url: '/mysubjectattainment',
        templateUrl: 'modules/attainments/client/views/list-attainments.client.view.html',
        controller: 'AttainmentsListController',
        controllerAs: 'vm',
        data: {
          roles: ['lecture'],
          pageTitle: 'Attainments List'
        }, 
        resolve: {
          lectureResolve: getLecture
        }
      })       
      .state('attainments.batchattainment', {
        url: '/batchattainment',
        templateUrl: 'modules/attainments/client/views/batch-attainments.client.view.html',
        controller: 'BatchAttainmentsController',
        controllerAs: 'vm',
        data: {
          roles: ['hod'],
          pageTitle: 'Attainments List'
        },
        resolve: {
          programResolve: getProgram
        }
      }) 
      .state('attainments.subjectattainment', {
        url: '/subjectattainment',
        templateUrl: 'modules/attainments/client/views/subject-attainments.client.view.html',
        controller: 'SubjectAttainmentsController',
        controllerAs: 'vm',
        data: {
          roles: ['hod','lecture'],
          pageTitle: 'Attainments List'
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
 

  getAttainment.$inject = ['$stateParams', 'AttainmentsService'];

  function getAttainment($stateParams, AttainmentsService) {
    return AttainmentsService.get({
      attainmentId: $stateParams.attainmentId
    }).$promise;
  }

  newAttainment.$inject = ['AttainmentsService'];

  function newAttainment(AttainmentsService) {
    return new AttainmentsService();
  }
}());
