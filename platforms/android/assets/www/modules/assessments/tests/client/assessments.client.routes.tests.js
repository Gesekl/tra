(function () {
  'use strict';

  describe('Assessments Route Tests', function () {
    // Initialize global variables
    var $scope,
      AssessmentsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _AssessmentsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      AssessmentsService = _AssessmentsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('assessments');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/assessments');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          AssessmentsController,
          mockAssessment;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('assessments.view');
          $templateCache.put('modules/assessments/client/views/view-assessment.client.view.html', '');

          // create mock Assessment
          mockAssessment = new AssessmentsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Assessment Name'
          });

          // Initialize Controller
          AssessmentsController = $controller('AssessmentsController as vm', {
            $scope: $scope,
            assessmentResolve: mockAssessment
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:assessmentId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.assessmentResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            assessmentId: 1
          })).toEqual('/assessments/1');
        }));

        it('should attach an Assessment to the controller scope', function () {
          expect($scope.vm.assessment._id).toBe(mockAssessment._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/assessments/client/views/view-assessment.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          AssessmentsController,
          mockAssessment;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('assessments.create');
          $templateCache.put('modules/assessments/client/views/form-assessment.client.view.html', '');

          // create mock Assessment
          mockAssessment = new AssessmentsService();

          // Initialize Controller
          AssessmentsController = $controller('AssessmentsController as vm', {
            $scope: $scope,
            assessmentResolve: mockAssessment
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.assessmentResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/assessments/create');
        }));

        it('should attach an Assessment to the controller scope', function () {
          expect($scope.vm.assessment._id).toBe(mockAssessment._id);
          expect($scope.vm.assessment._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/assessments/client/views/form-assessment.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          AssessmentsController,
          mockAssessment;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('assessments.edit');
          $templateCache.put('modules/assessments/client/views/form-assessment.client.view.html', '');

          // create mock Assessment
          mockAssessment = new AssessmentsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Assessment Name'
          });

          // Initialize Controller
          AssessmentsController = $controller('AssessmentsController as vm', {
            $scope: $scope,
            assessmentResolve: mockAssessment
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:assessmentId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.assessmentResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            assessmentId: 1
          })).toEqual('/assessments/1/edit');
        }));

        it('should attach an Assessment to the controller scope', function () {
          expect($scope.vm.assessment._id).toBe(mockAssessment._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/assessments/client/views/form-assessment.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
