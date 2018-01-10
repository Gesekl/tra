(function () {
  'use strict';

  angular
    .module('assessments')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('assessments', {
        abstract: true,
        url: '/assessments',
        template: '<ui-view/>'
      })
      .state('assessments.list', {
        url: '',
        templateUrl: 'modules/assessments/client/views/list-assessments.client.view.html',
        controller: 'AssessmentsListController',
        controllerAs: 'vm',
         resolve: {
          assessmentResolve: newAssessment
          //lectureResolve: getLecture
        },
        data: {
          roles: ['hod','lecture'],
          pageTitle: 'Assessments List'
        }
      })
      .state('assessments.internal', {
        url: '/internal',
        templateUrl: 'modules/assessments/client/views/internal-assessment.client.view.html',
        controller: 'InternalAssessmentController',
        controllerAs: 'vm',
        resolve: {
          assessmentResolve: newAssessment
          //lectureResolve: getLecture
        },
        data: {
          roles: ['lecture'],
          pageTitle: 'Assessments Create'
        }
      }) 
      //created By veda on 19-08-17
      .state('assessments.question', {
        url: '/internalQP',
        templateUrl: 'modules/assessments/client/views/lqp-assessment.client.view.html',
        controller: 'lqpAssessmentController',
        controllerAs: 'vm',
        resolve: {
          assessmentResolve: newAssessment
          //lectureResolve: getLecture
        },
        data: {
          roles: ['lecture'],
          pageTitle: 'Assessments Create'
        }
      })
       .state('assessments.student', {
        url: '/student',
        templateUrl: 'modules/assessments/client/views/student-assessment.client.view.html',
        controller: 'StudentAssessmentController',
        controllerAs: 'vm',
        resolve: {
          studentResolve: getStudent
        },
        data: {
          roles: ['student'],
          pageTitle: 'My Assessment'
        }
      })
       // created By veda for parent  student assessment list
       .state('assessments.parent', {
        url: '/parent',
        templateUrl: 'modules/assessments/client/views/student-assessment.client.view.html',
        controller: 'StudentAssessmentController',
        controllerAs: 'vm',
        resolve: {
         studentResolve: getStudent
        },
        data: {
          roles: ['parent'],
          pageTitle: 'Student Assessment'
        }
      })
      // created By veda on 19-08-17
      .state('assessments.qpstudent', {
        url: '/studentQP',
        templateUrl: 'modules/assessments/client/views/sqp-assessment.client.view.html',
        controller: 'sqpAssessmentController',
        controllerAs: 'vm',
        resolve: {
          studentResolve: getStudent
        },
        data: {
          roles: ['student'],
          pageTitle: 'My Assessment'
        }
      })
      .state('assessments.edit', {
        url: '/:assessmentId/edit',
        templateUrl: 'modules/assessments/client/views/form-assessment.client.view.html',
        controller: 'AssessmentsController',
        controllerAs: 'vm',
        resolve: {
          assessmentResolve: getAssessment
        },
        data: {
          roles: ['hod','lecture'],
          pageTitle: 'Edit Assessment {{ assessmentResolve.name }}'
        }
      })
      .state('assessments.view', {
        url: '/:assessmentId',
        templateUrl: 'modules/assessments/client/views/view-assessment.client.view.html',
        controller: 'AssessmentsController',
        controllerAs: 'vm',
        resolve: {
          assessmentResolve: getAssessment
        },
        data: {
          pageTitle: 'Assessment {{ assessmentResolve.name }}'
        }
      });
  }

  getLecture.$inject = ['Authentication', 'LecturesService'];

  function getLecture(Authentication, LecturesService){
      return LecturesService.get({ path: 'mappedUserId', mappedUserId: Authentication.user._id }).$promise;
  }

  getStudent.$inject = ['Authentication', 'StudentsService'];

  function getStudent(Authentication, StudentsService){
      return StudentsService.get({ path: 'mappedUserId', mappedUserId: Authentication.user._id }).$promise;
  }
  //created By veda for parent
  function getParent(Authentication, StudentsService){
      return StudentsService.get({ path: 'mappedUserId', mappedUserId: Authentication.user._id }).$promise;
  }

  getProgram.$inject = ['Authentication', 'ProgramsService'];

  function getProgram(Authentication, ProgramsService){
      return ProgramsService.get({ path: 'mappedUserId', mappedUserId: Authentication.user._id }).$promise;
  }

  getAssessment.$inject = ['$stateParams', 'AssessmentsService'];

  function getAssessment($stateParams, AssessmentsService) {
    return AssessmentsService.get({
      assessmentId: $stateParams.assessmentId
    }).$promise;
  }

  newAssessment.$inject = ['AssessmentsService'];

  function newAssessment(AssessmentsService) {
    return new AssessmentsService();
  }
}());
