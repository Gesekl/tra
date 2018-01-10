(function () {
  'use strict';

  angular
    .module('attendances')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('attendances', {
        abstract: true,
        url: '/attendances',
        template: '<ui-view/>'
      })
      .state('attendances.list', {
        url: '',
        templateUrl: 'modules/attendances/client/views/list-attendances.client.view.html',
        controller: 'AttendancesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Attendances List'
        }
      })
      .state('attendances.create', {
        url: '/create',
        templateUrl: 'modules/attendances/client/views/form-attendance.client.view.html',
        controller: 'AttendancesController',
        controllerAs: 'vm',
        resolve: {
          attendanceResolve: newAttendance
        },
        data: {
          roles: ['lecture','college_admin'],
          pageTitle: 'Attendances Create'
        }
      })
      .state('attendances.update', {
        url: '/update',
        templateUrl: 'modules/attendances/client/views/update-attendance.client.view.html',
        controller: 'UpdateAttendancesController',
        controllerAs: 'vm',
        resolve: {
          attendanceResolve: newAttendance
        },
        data: {
          roles: ['lecture'],
          pageTitle: 'Attendances Create'
        }
      })
      .state('attendances.edit', {
        url: '/:attendanceId/edit',
        templateUrl: 'modules/attendances/client/views/form-attendance.client.view.html',
        controller: 'AttendancesController',
        controllerAs: 'vm',
        resolve: {
          attendanceResolve: getAttendance
        },
        data: {
          roles: ['lecture','college_admin'],
          pageTitle: 'Edit Attendance {{ attendanceResolve.name }}'
        }
      })
      //summary list routeConfig
      .state('attendances.summary', {
        url: '/summary',
        templateUrl: 'modules/attendances/client/views/summary-list.client.view.html',
        controller: 'AttendancesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'summary List'
        }
      })//summary list routeConfig
      .state('attendances.studentsummary', {
        url: '/studentsummary',
        templateUrl: 'modules/attendances/client/views/student-attendances.client.view.html',
        controller: 'StuAttendancesListController',
        controllerAs: 'vm',
        resolve: {
          studentResolve: getStudent
        },
        data: {
          roles: ['student','college_admin'],
          pageTitle: 'My Assessment'
        }
      })// attendance summery for parent
      .state('attendances.parent', {
        url: '/student-attendance-summery',
        templateUrl: 'modules/attendances/client/views/student-attendances.client.view.html',
        controller: 'StuAttendancesListController',
        controllerAs: 'vm',
        resolve: {
          studentResolve: getStudent
        },
        data: {
          roles: ['parent','college_admin'],
          pageTitle: 'student Assessment'
        }
      })
      .state('attendances.view', {
        url: '/:attendanceId',
        templateUrl: 'modules/attendances/client/views/view-attendance.client.view.html',
        controller: 'AttendancesController',
        controllerAs: 'vm',
        resolve: {
          attendanceResolve: getAttendance
        },
        data: {
          pageTitle: 'Attendance {{ attendanceResolve.name }}'
        }
      });
  }

  getAttendance.$inject = ['$stateParams', 'AttendancesService'];

  function getAttendance($stateParams, AttendancesService) {
    return AttendancesService.get({
      attendanceId: $stateParams.attendanceId
    }).$promise;
  }

  newAttendance.$inject = ['AttendancesService'];

  function newAttendance(AttendancesService) {
    return new AttendancesService();
  }
  //create by veda
    getStudent.$inject = ['Authentication', 'StudentsService'];

  function getStudent(Authentication, StudentsService){
      return StudentsService.get({ path: 'mappedUserId', mappedUserId: Authentication.user._id }).$promise;
  }
}());
