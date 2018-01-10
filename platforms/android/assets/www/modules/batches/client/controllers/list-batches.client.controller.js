(function () {
  'use strict';

  angular
    .module('batches')
    .controller('BatchesListController', BatchesListController);

  BatchesListController.$inject = ['BatchesService','uiGridExporterConstants','toaster','uiGridConstants'];

  function BatchesListController(BatchesService, uiGridExporterConstants,toaster,uiGridConstants) {
    var vm = this;

     let cellTemplate = `<a class="btn btn-primary btn-xs"
                            ui-sref="batches.edit({ batchId: row.entity._id })" uib-tooltip="Edit batch" tooltip-placement="bottom">
                            <i class="glyphicon glyphicon-edit"></i>
                          </a>
                          <a class="btn btn-primary btn-xs" ng-click="grid.appScope.onDeleteRequest(row.entity)" uib-tooltip="Delete batch" tooltip-placement="bottom">                           
                            <i class="glyphicon glyphicon-trash"></i>                        
                          </a>`;

    vm.batchGridOptions = {
       enableHorizontalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
      enableVerticalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
     	enableFiltering: true,
    	allowCellFocus: true,
    	showFooter: true,
    	rowHeight: 36,
			enableGridMenu: true,
      appScopeProvider : vm,
      exporterCsvFilename: 'batches.csv',
      onRegisterApi: function (gridApi) {
				vm.gridApi = gridApi;
			},
      columnDefs: [
       { field: 'name', displayName: 'Batch Name',width:210},
        { field: 'sdate', displayName: 'Start Date',width:210 },
        { field: 'edate', displayName: 'End Date',width:210 },
        { field: 'nor', displayName: 'Number of Students',width:210 },
        { field: 'system', displayName: 'System',width:210 },
        {field: 'action', cellTemplate: cellTemplate,width:210}  
      ]
    };

    vm.onDeleteRequest = ( batchObj )=>{
      let res = toaster.pop('error', "Batch", "Batch Deleted Successfully!!");
      if( res ){
        BatchesService.get({ batchId: batchObj._id}, ( batch )=>{
          batch.$remove((status)=>{
           vm.batchGridOptions.data = vm.batchGridOptions.data.filter((bt)=>{
              return bt._id !== batchObj._id;
            },(err)=>{
             toaster.pop('warning', "Batch", "Unable to delete batch!!");
            });
          });          
        }, (err)=>{
            toaster.pop('warning', "Batch", "Unable to delete batch!!");
        });
      }
    };

    vm.exportBatches = () => {
			vm.gridApi.exporter.csvExport(uiGridExporterConstants.VISIBLE, uiGridExporterConstants.ALL);
		};

    BatchesService.query().$promise.then(function (batches) {
      vm.batchGridOptions.data = batches;
    });
  }
} ());
