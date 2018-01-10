(function () {
  'use strict';

  angular
    .module('students')
    .controller('StudentsListController', StudentsListController);

  StudentsListController.$inject = ['$scope','StudentsService','BatchesService','Authentication','uiGridExporterConstants','toaster','uiGridConstants'];

  function StudentsListController($scope, StudentsService, BatchesService, Authentication, uiGridExporterConstants,toaster,uiGridConstants) {
    var vm = this;

		vm.batches = BatchesService.query();   
    vm.sections = ['A','B','C','D','E','F'];
    vm.isDirtyGrid = false;
    vm.listOfStudentsDetailsHavingIssues = [];
    vm.down=true;
    vm.up=false;
    vm.close= function (){
      vm.listOfStudentsDetailsHavingIssues.length=0;
    };
    vm.hide = function() {
      vm.down=false;
      vm.up=true;
    };
    vm.show = function(){ 
      vm.down=true;
      vm.up=false;
    };

    let importStudents = (grid, students)=>{
				vm.studentGridOptions.data = students.map((student) => {
					student.program = Authentication.user.rootId;
          student.batch = vm.search.batchId;
          student.section = vm.search.section;
					return student;
				});
				vm.isGridDirty = true;
		};

    let cellTemplate = `<a class="btn btn-primary btn-xs"
                            ui-sref="students.edit({ studentId: row.entity._id })">
                            <i class="glyphicon glyphicon-edit"></i>
                          </a>
                          <a class="btn btn-primary btn-xs" ng-click="grid.appScope.onDeleteRequest(row.entity)">                           
                            <i class="glyphicon glyphicon-trash"></i>                        
                          </a>`;

    vm.studentGridOptions = {
      enableHorizontalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
      enableVerticalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
    	enableFiltering: true,
    	allowCellFocus: true,
    	showFooter: true,
    	rowHeight: 36,
			enableGridMenu: true,
      appScopeProvider : vm,
			exporterCsvFilename: 'students.csv',
      importerDataAddCallback: importStudents,
    	columnDefs: [
         {field: 'firstName', displayName:'First Name',width:210},
        {field: 'lastName', displayName:'Last Name',width:210},
        {field: 'usn', displayName:'USN',width:210},       
        {field: 'contact', displayName:'Contact',width:210},
        {field: 'email', displayName:'E-mail',width:210},
        {field: 'action', cellTemplate: cellTemplate,width:210 }      	
    	],
      onRegisterApi: function(gridApi){
        vm.gridApi = gridApi;
      }
    };

    vm.onDeleteRequest = ( stdObj )=>{
      let res =   toaster.pop('error', "Student", "Student Deleted Successfully!!");
      if( res ){
        StudentsService.get({ studentId: stdObj._id}, (std)=>{
          std.$remove((status)=>{
             vm.studentGridOptions.data = vm.studentGridOptions.data.filter((std)=>{
              return std._id !== stdObj._id;
            },(err)=>{
               toaster.pop('warning', "Student", "Unable to delete student!!");
            });
          });          
        }, (err)=>{
           toaster.pop('warning', "Student", "Unable to delete student!!");
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

    vm.exportStudents = ()=>{
       vm.gridApi.exporter.csvExport(uiGridExporterConstants.VISIBLE,uiGridExporterConstants.ALL);
    };


		vm.onChangeOptions = ()=>{
        vm.studentGridOptions.data = [];
        if( vm.search.batchId && vm.search.section ){
           StudentsService.getStudentsForBatch({ batchId: vm.search.batchId, section: vm.search.section }, (students)=>{
               if( students ){
                 vm.studentGridOptions.data = students;
               }
					 }, (error)=>{
              toaster.pop('error', "Students", "Unable to get students for batch and section!!");
					 });
        }
    };   

    let getInvalidGridRows = ()=>{
        let inValidGridRows = vm.studentGridOptions.data.filter((data, index)=>{
            if( !data.email || !data.firstName || !data.lastName || !data.usn || !data.contact){
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
          toaster.pop('warning', "Student", "Grid Rows Are Invalid: Student first name, last name, usn, email, contact fields are mandatory!!");
        } else {
          StudentsService.bulkUpdate({ 'path': 'bulk' }, vm.studentGridOptions.data, (res) => {
            if( res.length > 0 ){
               toaster.pop('warning', "Student", "Unable to create some of the student details!!");
					    	vm.listOfStudentsDetailsHavingIssues = res;		
            }else {
                toaster.pop('success', "Student", "Students updated Successfully!!");
              vm.refresh();
            }
          }, (err) => {
             toaster.pop('warning', "Student", "Unable to update Students!!");
          });
        }
      };

      vm.refresh = ()=>{
        vm.studentGridOptions.data = StudentsService.query( vm.search );
        vm.isGridDirty = true;
        vm.listOfStudentsDetailsHavingIssues = [];
      };

  }

  angular
    .module('students')
    .directive('customOnChange', function() {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      var onChangeHandler = scope.$eval(attrs.customOnChange);
      element.bind('change', onChangeHandler);
    }
  };
});
}());
