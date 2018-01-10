(function () {
  'use strict';

  angular
    .module('lectures')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('lectures', {
        abstract: true,
        url: '/lectures',
        template: '<ui-view/>'
      })
      .state('lectures.list', {
        url: '',
        templateUrl: 'modules/lectures/client/views/list-lectures.client.view.html',
        controller: 'LecturesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Lectures List'
        }
      })
      .state('lectures.mysubjects', {
        url: '/mysubjects',
        templateUrl: 'modules/lectures/client/views/subjects-lectures.client.view.html',
        controller: 'LecturesSubjectsController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Lectures List'
        }
      })   
      .state('lectures.create', {
        url: '/create',
        templateUrl: 'modules/lectures/client/views/form-lecture.client.view.html',
        controller: 'LecturesController',
        controllerAs: 'vm',
        resolve: {
          lectureResolve: newLecture
        },
        data: {
          roles: [ 'hod','college_admin'],
          pageTitle: 'Lectures Create'
        }
      })
      .state('lectures.edit', {
        url: '/:lectureId/edit',
        templateUrl: 'modules/lectures/client/views/form-lecture.client.view.html',
        controller: 'LecturesController',
        controllerAs: 'vm',
        resolve: {
          lectureResolve: getLecture
        },
        data: {
          roles: [ 'hod','college_admin'],
          pageTitle: 'Edit Lecture {{ lectureResolve.name }}'
        }
      })
      .state('lectures.view', {
        url: '/:lectureId',
        templateUrl: 'modules/lectures/client/views/view-lecture.client.view.html',
        controller: 'LecturesController',
        controllerAs: 'vm',
        resolve: {
          lectureResolve: getLecture
        },
        data: {
          pageTitle: 'Lecture {{ lectureResolve.name }}'
        }
      });
  }

  getLecture.$inject = ['$stateParams', 'LecturesService'];

  function getLecture($stateParams, LecturesService) {
    return LecturesService.get({
      lectureId: $stateParams.lectureId
    }).$promise;
  }

  newLecture.$inject = ['LecturesService'];

  function newLecture(LecturesService) {
    return new LecturesService();
  }
}());
