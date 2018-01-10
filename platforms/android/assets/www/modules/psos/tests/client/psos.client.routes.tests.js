(function () {
  'use strict';

  describe('Psos Route Tests', function () {
    // Initialize global variables
    var $scope,
      PsosService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _PsosService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      PsosService = _PsosService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('psos');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/psos');
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
          PsosController,
          mockPso;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('psos.view');
          $templateCache.put('modules/psos/client/views/view-pso.client.view.html', '');

          // create mock Pso
          mockPso = new PsosService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Pso Name'
          });

          // Initialize Controller
          PsosController = $controller('PsosController as vm', {
            $scope: $scope,
            psoResolve: mockPso
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:psoId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.psoResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            psoId: 1
          })).toEqual('/psos/1');
        }));

        it('should attach an Pso to the controller scope', function () {
          expect($scope.vm.pso._id).toBe(mockPso._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/psos/client/views/view-pso.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          PsosController,
          mockPso;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('psos.create');
          $templateCache.put('modules/psos/client/views/form-pso.client.view.html', '');

          // create mock Pso
          mockPso = new PsosService();

          // Initialize Controller
          PsosController = $controller('PsosController as vm', {
            $scope: $scope,
            psoResolve: mockPso
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.psoResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/psos/create');
        }));

        it('should attach an Pso to the controller scope', function () {
          expect($scope.vm.pso._id).toBe(mockPso._id);
          expect($scope.vm.pso._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/psos/client/views/form-pso.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          PsosController,
          mockPso;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('psos.edit');
          $templateCache.put('modules/psos/client/views/form-pso.client.view.html', '');

          // create mock Pso
          mockPso = new PsosService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Pso Name'
          });

          // Initialize Controller
          PsosController = $controller('PsosController as vm', {
            $scope: $scope,
            psoResolve: mockPso
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:psoId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.psoResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            psoId: 1
          })).toEqual('/psos/1/edit');
        }));

        it('should attach an Pso to the controller scope', function () {
          expect($scope.vm.pso._id).toBe(mockPso._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/psos/client/views/form-pso.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
