(function () {
  'use strict';

  angular
    .module('subjects')
    .controller('SubjectsListController', SubjectsListController);

  SubjectsListController.$inject = ['SubjectsService','BatchesService', 'Authentication','uiGridExporterConstants','toaster','uiGridConstants'];

  function SubjectsListController(SubjectsService, BatchesService, Authentication, uiGridExporterConstants,toaster,uiGridConstants) {
    var vm = this;

    vm.subjects = SubjectsService.query();
    vm.batches = BatchesService.query();
    vm.sections = ['A','B','C','D','E','F'];
    vm.semesters = [1,2,3,4,5,6,7,8];
   
    vm.isGridDirty = false;
    
    let importSubjects = (grid, subjects) => {
      vm.subjectsGridOptions.data = subjects.map((subject) => {
        subject.program = Authentication.user.rootId;
        subject.batch = vm.search.batchId;
        subject.section = vm.search.section;
        return subject;
      });
      vm.isGridDirty = true;
    };

    let cellTemplate = `<a class="btn btn-primary btn-xs"
                        ui-sref='subjects.edit({ subjectId: row.entity._id })'" uib-tooltip="Edit subject" tooltip-placement="bottom">
                        <i class="glyphicon glyphicon-edit"></i>
                      </a>
                      <a class="btn btn-primary btn-xs" ng-click="grid.appScope.vm.onDeleteRequest(row.entity)" uib-tooltip="Delete subject" tooltip-placement="bottom">                           
                        <i class="glyphicon glyphicon-trash"></i>                        
                      </a>`;

    vm.subjectsGridOptions = {
       enableHorizontalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
      enableVerticalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
    	enableFiltering: true,
    	allowCellFocus: true,
      enableGridMenu: true,
    	showFooter: true,
    	rowHeight: 36,
      exporterCsvFilename: 'subjects.csv',
      importerDataAddCallback: importSubjects,
      onRegisterApi: function (gridApi) {
				vm.gridApi = gridApi;
			},
    	columnDefs: [
    	 {field: 'name', displayName:'Name',width:320},
        {field: 'semester', displayName:'Semester',width:320},
        {field: 'subjectCode', displayName:'Code',width:320},
        { field: 'action',
        displayname:'Action',
        // enableCellEdit: false,
        // enableFiltering: false,
        // enableSorting: false,
        cellTemplate : cellTemplate,
        width:200
   }       
    	]
    };

    vm.import = (event)=>{
      var target = event.srcElement || event.target;
    
      if ( target && target.files && target.files.length === 1) {
        var fileObject = target.files[0];
        vm.gridApi.importer.importFile( fileObject );
        target.form.reset();
      }
    };

    vm.onDeleteRequest=(SubjectObj)=>{
      let res =   toaster.pop('error', "Subject", "Subject Deleted Successfully!!");
			if( res ){
				SubjectsService.get({ subjectId: SubjectObj._id}, ( sub )=>{
				sub.$remove((status)=>{
						vm.subjectsGridOptions.data = vm.subjectsGridOptions.data.filter((sub)=>{
						return sub._id !== SubjectObj._id;
					},(err)=>{
            toaster.pop('warning', "Subject", "Unable to delete lecture!!");
						});
				});          
      }, (err)=>{
          toaster.pop('warning', "Subject", "Unable to delete lecture!!");
					});
			}
    }

    vm.exportBatches = () => {
			vm.gridApi.exporter.csvExport(uiGridExporterConstants.VISIBLE, uiGridExporterConstants.ALL);
		};

    vm.onSearchOptionChange = ()=>{
      if( vm.search && vm.search.batchId && vm.search.section ){
         vm.subjectsGridOptions.data = SubjectsService.query( vm.search );
      }
    };

    let getInvalidGridRows = ()=>{
			 let inValidGridRows = vm.subjectsGridOptions.data.filter((data, index)=>{
				  if( !data.name || !data.subjectCode || !data.semester ){
						return true;
					}else {
						return false;
					}
			 });
			 return inValidGridRows;
		};

		vm.save = () => {
			let inValidGridRows = getInvalidGridRows();
			if (inValidGridRows.length > 0) {
       toaster.pop('warning', "Subjects", "Grid Rows Are Invalid: Subject Name, Code, Semester fields are mandatory!!");
			} else {
				SubjectsService.bulkUpdate({ 'path': 'bulk' }, vm.subjectsGridOptions.data, (res) => {
           toaster.pop('success', "Subjects", "Subjects updated Successfully!!");
					vm.refresh();
				}, (err) => {
            toaster.pop('warning', "Subjects", "Unable to update Subjects!!");
					});
			}
		};

		vm.refresh = ()=>{
		  vm.subjectsGridOptions.data = SubjectsService.query( vm.search );
			vm.isGridDirty = true;
		};


  }
}());
