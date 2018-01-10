(function () {
  'use strict';

  describe('Psos List Controller Tests', function () {
    // Initialize global variables
    var PsosListController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      PsosService,
      mockPso;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _PsosService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      PsosService = _PsosService_;

      // create mock article
      mockPso = new PsosService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Pso Name'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Psos List controller.
      PsosListController = $controller('PsosListController as vm', {
        $scope: $scope
      });

      // Spy on state go
      spyOn($state, 'go');
    }));

    describe('Instantiate', function () {
      var mockPsoList;

      beforeEach(function () {
        mockPsoList = [mockPso, mockPso];
      });

      it('should send a GET request and return all Psos', inject(function (PsosService) {
        // Set POST response
        $httpBackend.expectGET('api/psos').respond(mockPsoList);


        $httpBackend.flush();

        // Test form inputs are reset
        expect($scope.vm.psos.length).toEqual(2);
        expect($scope.vm.psos[0]).toEqual(mockPso);
        expect($scope.vm.psos[1]).toEqual(mockPso);

      }));
    });
  });
}());
