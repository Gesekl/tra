(function () {
  'use strict';

  angular
    .module('subjects')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('subjects', {
        abstract: true,
        url: '/subjects',
        template: '<ui-view/>'
      })
      .state('subjects.list', {
        url: '',
        templateUrl: 'modules/subjects/client/views/list-subjects.client.view.html',
        controller: 'SubjectsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Subjects List'
        }
      })     
      .state('subjects.create', {
        url: '/create',
        templateUrl: 'modules/subjects/client/views/form-subject.client.view.html',
        controller: 'SubjectsController',
        controllerAs: 'vm',
        resolve: {
          subjectResolve: newSubject
        },
        data: {
          roles: ['hod','college_admin'],
          pageTitle: 'Subjects Create'
        }
      })
      .state('subjects.edit', {
        url: '/:subjectId/edit',
        templateUrl: 'modules/subjects/client/views/form-subject.client.view.html',
        controller: 'SubjectsController',
        controllerAs: 'vm',
        resolve: {
          subjectResolve: getSubject
        },
        data: {
          roles: ['hod','lecture','college_admin'],
          pageTitle: 'Edit Subject {{ subjectResolve.name }}'
        }
      })
      .state('subjects.config', {
        url: '/:subjectId/config',
        templateUrl: 'modules/subjects/client/views/config.client.view.html',
        controller: 'SubjectConfigController',
        controllerAs: 'vm',
        resolve: {
          subjectResolve: getSubject
        },
        data: {
          roles: ['hod','lecture','college_admin'],
          pageTitle: 'Subject Configuration {{ subjectResolve.name }}'
        }
      })
      .state('subjects.questioner', {
        url: '/:subjectId/questioner',
        templateUrl: 'modules/subjects/client/views/questioners.client.view.html',
        controller: 'SubjectsQuestionersController',
        controllerAs: 'vm',
        resolve: {
          subjectResolve: getSubject
        },
        data: {
          roles: ['hod','lecture','college_admin'],
          pageTitle: 'Subject Questioner'
        }
      })
      .state('subjects.subjectToLecture', {
        url: '/subjectToLecture',
        templateUrl: 'modules/subjects/client/views/subjects-to-lectures.client.view.html',
        controller: 'SubjectsToLecturesController',
        controllerAs: 'vm',      
        data: {
          roles: ['hod','lecture','college_admin'],
          pageTitle: 'Allocate Lecture to Subject'
        }
      })
      .state('subjects.view', {
        url: '/:subjectId',
        templateUrl: 'modules/subjects/client/views/view-subject.client.view.html',
        controller: 'SubjectsController',
        controllerAs: 'vm',
        resolve: {
          subjectResolve: getSubject
        },
        data: {
          pageTitle: 'Subject {{ subjectResolve.name }}'
        }
      });
  }

  getSubject.$inject = ['$stateParams', 'SubjectsService'];

  function getSubject($stateParams, SubjectsService) {
    return SubjectsService.get({
      subjectId: $stateParams.subjectId
    }).$promise;
  }

  newSubject.$inject = ['SubjectsService'];

  function newSubject(SubjectsService) {
    return new SubjectsService();
  }
}());
