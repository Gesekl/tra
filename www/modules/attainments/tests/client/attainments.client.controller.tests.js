(function () {
  'use strict';

  describe('Attainments Controller Tests', function () {
    // Initialize global variables
    var AttainmentsController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      AttainmentsService,
      mockAttainment;

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
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _AttainmentsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      AttainmentsService = _AttainmentsService_;

      // create mock Attainment
      mockAttainment = new AttainmentsService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Attainment Name'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Attainments controller.
      AttainmentsController = $controller('AttainmentsController as vm', {
        $scope: $scope,
        attainmentResolve: {}
      });

      // Spy on state go
      spyOn($state, 'go');
    }));

    describe('vm.save() as create', function () {
      var sampleAttainmentPostData;

      beforeEach(function () {
        // Create a sample Attainment object
        sampleAttainmentPostData = new AttainmentsService({
          name: 'Attainment Name'
        });

        $scope.vm.attainment = sampleAttainmentPostData;
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (AttainmentsService) {
        // Set POST response
        $httpBackend.expectPOST('api/attainments', sampleAttainmentPostData).respond(mockAttainment);

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL redirection after the Attainment was created
        expect($state.go).toHaveBeenCalledWith('attainments.view', {
          attainmentId: mockAttainment._id
        });
      }));

      it('should set $scope.vm.error if error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/attainments', sampleAttainmentPostData).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      });
    });

    describe('vm.save() as update', function () {
      beforeEach(function () {
        // Mock Attainment in $scope
        $scope.vm.attainment = mockAttainment;
      });

      it('should update a valid Attainment', inject(function (AttainmentsService) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/attainments\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($state.go).toHaveBeenCalledWith('attainments.view', {
          attainmentId: mockAttainment._id
        });
      }));

      it('should set $scope.vm.error if error', inject(function (AttainmentsService) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/attainments\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      }));
    });

    describe('vm.remove()', function () {
      beforeEach(function () {
        // Setup Attainments
        $scope.vm.attainment = mockAttainment;
      });

      it('should delete the Attainment and redirect to Attainments', function () {
        // Return true on confirm message
        spyOn(window, 'confirm').and.returnValue(true);

        $httpBackend.expectDELETE(/api\/attainments\/([0-9a-fA-F]{24})$/).respond(204);

        $scope.vm.remove();
        $httpBackend.flush();

        expect($state.go).toHaveBeenCalledWith('attainments.list');
      });

      it('should should not delete the Attainment and not redirect', function () {
        // Return false on confirm message
        spyOn(window, 'confirm').and.returnValue(false);

        $scope.vm.remove();

        expect($state.go).not.toHaveBeenCalled();
      });
    });
  });
}());
