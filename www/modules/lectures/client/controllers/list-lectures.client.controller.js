(function () {
	'use strict';

	angular
		.module('lectures')
		.controller('LecturesListController', LecturesListController);

	LecturesListController.$inject = ['LecturesService', 'Authentication', 'uiGridExporterConstants','toaster','uiGridConstants'];

	function LecturesListController(LecturesService, Authentication, uiGridExporterConstants,toaster,uiGridConstants) {
		var vm = this;

		vm.isGridDirty = false;
		vm.listOfLecturesDetailsHavingIssues = [];


		let importLectures = (grid, lecturers)=>{
				vm.listOfLecturesDetailsHavingIssues = [];
				vm.lectureGridOptions.data = lecturers.map((lecture) => {
					lecture.program = Authentication.user.rootId;
					return lecture;
				});
				vm.isGridDirty = true;
		};

		let cellTemplate = `<a class="btn btn-primary btn-xs"
                            ui-sref="lectures.edit({ lectureId: row.entity._id })">
                            <i class="glyphicon glyphicon-edit"></i>
                          </a>
                          <a class="btn btn-primary btn-xs" ng-click="grid.appScope.onDeleteRequest(row.entity)">                           
                            <i class="glyphicon glyphicon-trash"></i>                        
                          </a>`;

		vm.lectureGridOptions = {
			enableHorizontalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
            enableVerticalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
			enableRowSelection: true,
			enableSelectAll: true,
			enableFiltering: true,
			allowCellFocus: true,
			enableGridMenu: true,
			showFooter: true,
			rowHeight: 36,
			exporterCsvFilename: 'lectures.csv',
			importerDataAddCallback: importLectures,
			appScopeProvider : vm,
			columnDefs: [
				{ field: 'employeeId', displayName: 'Emp Id',width:210},
				{ field: 'firstName', displayName: 'First Name',width:210 },
				{ field: 'lastName', displayName: 'Last Name',width:210 },
				{ field: 'designation', displayName: 'Designation',width:210 },
				{ field: 'email', displayName: 'Email',width:210 },
				{ field: 'contact', displayName: 'Contact',width:210 },
				{ field: 'qualification', displayName: 'Qualification',width:210 },
				{ field: 'skills', displayName: 'Skills',width:210 },
				{field: 'action', cellTemplate: cellTemplate,width:210 }
 
			],
			onRegisterApi: function (gridApi) {
				vm.gridApi = gridApi;
			}
		};

		  vm.onDeleteRequest = ( lectureObj )=>{  
			let res = toaster.pop('error', "Lecturer", "Lecture Deleted Successfully!!");
			if( res ){
				LecturesService.get({ lectureId: lectureObj._id}, ( lec )=>{
				lec.$remove((status)=>{
						vm.lectureGridOptions.data = vm.lectureGridOptions.data.filter((lec)=>{
						return lec._id !== lectureObj._id;
					},(err)=>{
						toaster.pop('warning', "Lecturer", "Unable to delete lecture!!");
						});
				});          
				}, (err)=>{
				       toaster.pop('warning', "Lecturer", "Unable to delete lecture!!");
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


		vm.exportLecturers = () => {
			vm.gridApi.exporter.csvExport(uiGridExporterConstants.VISIBLE, uiGridExporterConstants.ALL);
		};

		let getInvalidGridRows = ()=>{
			 let inValidGridRows = vm.lectureGridOptions.data.filter((data, index)=>{
				  if( !data.employeeId || !data.firstName || !data.email || !data.lastName 
				  	|| !data.qualification || !data.skills){
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
				toaster.pop('error', "Lecturer", "Grid Rows Are Invalid: Employee Id, Name, Contact, Email fields are mandatory!!");
			} else {
				LecturesService.bulkUpdate({ 'path': 'bulk' }, vm.lectureGridOptions.data, (res) => {				 
					if( res.length > 0 ){
						toaster.pop('warning', "Lecturer", "Unable to create some of the lecture details!!");
						vm.listOfLecturesDetailsHavingIssues = res;						
					}else {
						toaster.pop('success', "Lecturer", "Lecturers updated Successfully!!");
						vm.refresh();
					}					
				}, (err) => {
						toaster.pop('warning', "Lecturer", "Unable to update lecturers!!");
				});
			}
		};

		vm.refresh = ()=>{
			vm.listOfLecturesDetailsHavingIssues = [];
			LecturesService.query().$promise.then(function (lecturers) {
				vm.lectureGridOptions.data = lecturers;
			});
			vm.isGridDirty = true;
		};

		vm.lectureGridOptions.data =	LecturesService.query();

	}

	angular
		.module('lectures')
		.directive('customOnChange', function () {
			return {
				restrict: 'A',
				link: function (scope, element, attrs) {
					var onChangeHandler = scope.$eval(attrs.customOnChange);
					element.bind('change', onChangeHandler);
				}
			};
		});
} ());