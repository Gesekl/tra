(function () {
  'use strict';

  describe('Subjects Route Tests', function () {
    // Initialize global variables
    var $scope,
      SubjectsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _SubjectsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      SubjectsService = _SubjectsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('subjects');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/subjects');
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
          SubjectsController,
          mockSubject;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('subjects.view');
          $templateCache.put('modules/subjects/client/views/view-subject.client.view.html', '');

          // create mock Subject
          mockSubject = new SubjectsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Subject Name'
          });

          // Initialize Controller
          SubjectsController = $controller('SubjectsController as vm', {
            $scope: $scope,
            subjectResolve: mockSubject
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:subjectId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.subjectResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            subjectId: 1
          })).toEqual('/subjects/1');
        }));

        it('should attach an Subject to the controller scope', function () {
          expect($scope.vm.subject._id).toBe(mockSubject._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/subjects/client/views/view-subject.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          SubjectsController,
          mockSubject;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('subjects.create');
          $templateCache.put('modules/subjects/client/views/form-subject.client.view.html', '');

          // create mock Subject
          mockSubject = new SubjectsService();

          // Initialize Controller
          SubjectsController = $controller('SubjectsController as vm', {
            $scope: $scope,
            subjectResolve: mockSubject
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.subjectResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/subjects/create');
        }));

        it('should attach an Subject to the controller scope', function () {
          expect($scope.vm.subject._id).toBe(mockSubject._id);
          expect($scope.vm.subject._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/subjects/client/views/form-subject.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          SubjectsController,
          mockSubject;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('subjects.edit');
          $templateCache.put('modules/subjects/client/views/form-subject.client.view.html', '');

          // create mock Subject
          mockSubject = new SubjectsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Subject Name'
          });

          // Initialize Controller
          SubjectsController = $controller('SubjectsController as vm', {
            $scope: $scope,
            subjectResolve: mockSubject
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:subjectId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.subjectResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            subjectId: 1
          })).toEqual('/subjects/1/edit');
        }));

        it('should attach an Subject to the controller scope', function () {
          expect($scope.vm.subject._id).toBe(mockSubject._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/subjects/client/views/form-subject.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
