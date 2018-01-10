(function () {
  'use strict';

  describe('Lectures Route Tests', function () {
    // Initialize global variables
    var $scope,
      LecturesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _LecturesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      LecturesService = _LecturesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('lectures');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/lectures');
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
          LecturesController,
          mockLecture;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('lectures.view');
          $templateCache.put('modules/lectures/client/views/view-lecture.client.view.html', '');

          // create mock Lecture
          mockLecture = new LecturesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Lecture Name'
          });

          // Initialize Controller
          LecturesController = $controller('LecturesController as vm', {
            $scope: $scope,
            lectureResolve: mockLecture
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:lectureId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.lectureResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            lectureId: 1
          })).toEqual('/lectures/1');
        }));

        it('should attach an Lecture to the controller scope', function () {
          expect($scope.vm.lecture._id).toBe(mockLecture._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/lectures/client/views/view-lecture.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          LecturesController,
          mockLecture;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('lectures.create');
          $templateCache.put('modules/lectures/client/views/form-lecture.client.view.html', '');

          // create mock Lecture
          mockLecture = new LecturesService();

          // Initialize Controller
          LecturesController = $controller('LecturesController as vm', {
            $scope: $scope,
            lectureResolve: mockLecture
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.lectureResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/lectures/create');
        }));

        it('should attach an Lecture to the controller scope', function () {
          expect($scope.vm.lecture._id).toBe(mockLecture._id);
          expect($scope.vm.lecture._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/lectures/client/views/form-lecture.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          LecturesController,
          mockLecture;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('lectures.edit');
          $templateCache.put('modules/lectures/client/views/form-lecture.client.view.html', '');

          // create mock Lecture
          mockLecture = new LecturesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Lecture Name'
          });

          // Initialize Controller
          LecturesController = $controller('LecturesController as vm', {
            $scope: $scope,
            lectureResolve: mockLecture
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:lectureId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.lectureResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            lectureId: 1
          })).toEqual('/lectures/1/edit');
        }));

        it('should attach an Lecture to the controller scope', function () {
          expect($scope.vm.lecture._id).toBe(mockLecture._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/lectures/client/views/form-lecture.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
