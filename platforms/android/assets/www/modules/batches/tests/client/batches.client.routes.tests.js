(function () {
  'use strict';

  describe('Batches Route Tests', function () {
    // Initialize global variables
    var $scope,
      BatchesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _BatchesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      BatchesService = _BatchesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('batches');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/batches');
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
          BatchesController,
          mockBatch;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('batches.view');
          $templateCache.put('modules/batches/client/views/view-batch.client.view.html', '');

          // create mock Batch
          mockBatch = new BatchesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Batch Name'
          });

          // Initialize Controller
          BatchesController = $controller('BatchesController as vm', {
            $scope: $scope,
            batchResolve: mockBatch
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:batchId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.batchResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            batchId: 1
          })).toEqual('/batches/1');
        }));

        it('should attach an Batch to the controller scope', function () {
          expect($scope.vm.batch._id).toBe(mockBatch._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/batches/client/views/view-batch.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          BatchesController,
          mockBatch;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('batches.create');
          $templateCache.put('modules/batches/client/views/form-batch.client.view.html', '');

          // create mock Batch
          mockBatch = new BatchesService();

          // Initialize Controller
          BatchesController = $controller('BatchesController as vm', {
            $scope: $scope,
            batchResolve: mockBatch
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.batchResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/batches/create');
        }));

        it('should attach an Batch to the controller scope', function () {
          expect($scope.vm.batch._id).toBe(mockBatch._id);
          expect($scope.vm.batch._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/batches/client/views/form-batch.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          BatchesController,
          mockBatch;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('batches.edit');
          $templateCache.put('modules/batches/client/views/form-batch.client.view.html', '');

          // create mock Batch
          mockBatch = new BatchesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Batch Name'
          });

          // Initialize Controller
          BatchesController = $controller('BatchesController as vm', {
            $scope: $scope,
            batchResolve: mockBatch
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:batchId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.batchResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            batchId: 1
          })).toEqual('/batches/1/edit');
        }));

        it('should attach an Batch to the controller scope', function () {
          expect($scope.vm.batch._id).toBe(mockBatch._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/batches/client/views/form-batch.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
