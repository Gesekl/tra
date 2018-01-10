(function () {
  'use strict';

  angular
    .module('programs')
    .controller('ProgramsListController', ProgramsListController);

  ProgramsListController.$inject = ['ProgramsService','Authentication','uiGridExporterConstants','toaster','uiGridConstants'];

  function ProgramsListController(ProgramsService,Authentication,uiGridExporterConstants,toaster,uiGridConstants) {
    var vm = this;

		vm.isGridDirty = false;
		vm.listOfprogramsDetailsHavingIssues = [];

	let importprograms = (grid, programs)=>{
				vm.listOfprogramsDetailsHavingIssues = [];
				vm.programGridOptions.data = programs.map((program) => {
					program.program = Authentication.user.rootId;
					return program;
				});
				vm.isGridDirty = true;
		};

		 let cellTemplate = `<a class="btn btn-primary btn-xs"
                            ui-sref="programs.edit({ programId: row.entity._id })" uib-tooltip="Edit batch" tooltip-placement="bottom">
                            <i class="glyphicon glyphicon-edit"></i>
                          </a>
                          <a class="btn btn-primary btn-xs" ng-click="grid.appScope.onDeleteRequest(row.entity)" uib-tooltip="Delete batch" tooltip-placement="bottom">                           
                            <i class="glyphicon glyphicon-trash"></i>                        
                          </a>`;

    vm.programGridOptions = {
    	    enableHorizontalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
            enableVerticalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
			enableRowSelection: true,
			enableSelectAll: true,
			enableFiltering: true,
			allowCellFocus: true,
			enableGridMenu: true,
			showFooter: true,
			rowHeight: 36,
			exporterCsvFilename: 'programs.csv',
			importerDataAddCallback: importprograms,
			appScopeProvider : vm,
			columnDefs: [
				{ field: 'name', displayName: 'Name',width:240},
				{ field: 'email', displayName: 'Email',width:240 },
				{field: 'contact',displayName:'Contact',width:240},
				{field: 'fax',displayName:'Fax',width:240},
				{field: 'action', cellTemplate: cellTemplate,width:210,padding: 13 }
			],
			onRegisterApi: function (gridApi) {
				vm.gridApi = gridApi;
			}
		};

		vm.onDeleteRequest = ( programObj )=>{
      let res = toaster.pop('error', "Program", "Program Deleted Successfully!!");
      if( res ){
        ProgramsService.get({ programId: programObj._id}, ( program )=>{
          program.$remove((status)=>{
           vm.programGridOptions.data = vm.programGridOptions.data.filter((prog)=>{
              return prog._id !== programObj._id;
            },(err)=>{
             toaster.pop('warning', "Program", "Unable to delete Program!!");
            });
          });          
        }, (err)=>{
           toaster.pop('warning', "Program", "Unable to delete Program!!");
        });
      }
    };

		  vm.import = (event)=>{
			var target = event.srcElement || event.target;
			
			if ( target && target.files && target.files.length === 1) {
				var fileObject = target.files[0];
				vm.gridApi.importer.importFile( fileObject );
				target.form.reset();
			}
		};

		vm.exportprograms = () => {
			vm.gridApi.exporter.csvExport(uiGridExporterConstants.VISIBLE, uiGridExporterConstants.ALL);
		};

    		vm.programGridOptions.data =	ProgramsService.query();

  }
}());
