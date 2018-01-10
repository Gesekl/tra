(function () {
  'use strict';

  describe('Psos Controller Tests', function () {
    // Initialize global variables
    var PsosController,
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

      // create mock Pso
      mockPso = new PsosService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Pso Name'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Psos controller.
      PsosController = $controller('PsosController as vm', {
        $scope: $scope,
        psoResolve: {}
      });

      // Spy on state go
      spyOn($state, 'go');
    }));

    describe('vm.save() as create', function () {
      var samplePsoPostData;

      beforeEach(function () {
        // Create a sample Pso object
        samplePsoPostData = new PsosService({
          name: 'Pso Name'
        });

        $scope.vm.pso = samplePsoPostData;
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (PsosService) {
        // Set POST response
        $httpBackend.expectPOST('api/psos', samplePsoPostData).respond(mockPso);

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL redirection after the Pso was created
        expect($state.go).toHaveBeenCalledWith('psos.view', {
          psoId: mockPso._id
        });
      }));

      it('should set $scope.vm.error if error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/psos', samplePsoPostData).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      });
    });

    describe('vm.save() as update', function () {
      beforeEach(function () {
        // Mock Pso in $scope
        $scope.vm.pso = mockPso;
      });

      it('should update a valid Pso', inject(function (PsosService) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/psos\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($state.go).toHaveBeenCalledWith('psos.view', {
          psoId: mockPso._id
        });
      }));

      it('should set $scope.vm.error if error', inject(function (PsosService) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/psos\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      }));
    });

    describe('vm.remove()', function () {
      beforeEach(function () {
        // Setup Psos
        $scope.vm.pso = mockPso;
      });

      it('should delete the Pso and redirect to Psos', function () {
        // Return true on confirm message
        spyOn(window, 'confirm').and.returnValue(true);

        $httpBackend.expectDELETE(/api\/psos\/([0-9a-fA-F]{24})$/).respond(204);

        $scope.vm.remove();
        $httpBackend.flush();

        expect($state.go).toHaveBeenCalledWith('psos.list');
      });

      it('should should not delete the Pso and not redirect', function () {
        // Return false on confirm message
        spyOn(window, 'confirm').and.returnValue(false);

        $scope.vm.remove();

        expect($state.go).not.toHaveBeenCalled();
      });
    });
  });
}());
