(function(){
    'use strict';

    angular
        .module('batches')
        .controller('CourseOutcomeController', CourseOutcomeController);

    
    CourseOutcomeController.$inject = ['$scope','BatchesService','Authentication','PosService','PsosService', 'programResolve'];

    /** @ngInject */
    function CourseOutcomeController($scope, BatchesService, Authentication, PosService, PsosService, programResolve ){
        var vm = this;

        vm.batches = BatchesService.query();
        vm.sections = ['A','B','C','D','E','F'];
        vm.search = { batchId: '', section:''};
        vm.copos = [];
        vm.copsos = [];
        vm.posList = ['PO1','PO2','PO3','PO4','PO5','PO6','PO7','PO8','PO9','PO10','PO11','PO12'];
        vm.psosList = ['PSO1','PSO2','PSO3','PSO4','PSO5','PSO6'];
        vm.pos = {};
        vm.psos = {};

        vm.exportToPdf = ()=>{
          let poHeader  = [ 'Subject', 'Code', ...vm.posList];
          let psoHeader  = [ 'Subject', 'Code', ...vm.psosList];
          let poBody = vm.copos.map((copo)=>{
              let poDetails = [];
              vm.posList.forEach((po)=>{  
                  if( copo[po] ){
                    poDetails.push( copo[po].toFixed(3) );
                  }else {
                    poDetails.push( "-");
                  }
              });
              return [
                  copo.subject,
                  copo.subjectCode,      
                  ...poDetails
              ];
          });
          let psoBody = vm.copsos.map((copso)=>{
              let psoDetails = [];
              vm.psosList.forEach((pso)=>{  
                  if( copso[pso] ){
                    psoDetails.push( copso[pso].toFixed(3) );
                  }else {
                    psoDetails.push( "-");
                  }
              });
              return [
                  copso.subject,
                  copso.subjectCode,                 
                  ...psoDetails
              ];
          });
         
          pdfMake.createPdf({content:[
            	{ text: 'CO-PO', style: 'header' },              
             {
                  table: {
                    body: [
                      poHeader,
                      ...poBody         
                    ]
                  }
              }, 
              { text: ' ', style: 'header' },
              { text: 'CO-PSO', style: 'header' },
              {
                  table: {
                    body: [
                      psoHeader,
                      ...psoBody         
                    ]
                  }
              }          
          ],		
          styles: {
                      header: {
                        fontSize: 18,
                        bold: true,
                        margin: [0, 0, 0, 10]
                      },
                      subheader: {
                        fontSize: 16,
                        bold: true,
                        margin: [0, 10, 0, 5]
                      },
                      tableExample: {
                        margin: [0, 5, 0, 15]
                      },
                      tableHeader: {
                        bold: true,
                        fontSize: 13,
                        color: 'black'
                      }
            }, defaultStyle: {
                fontSize: 9
              }
          }).open();
        };

        vm.onSearchOptionChange = ()=>{
            vm.fetchCOPODetails();
            vm.fetchCOPSODetails();
        };

        vm.fetchCOPODetails = ()=>{
            if( vm.search.batchId && vm.search.section ){
            vm.copos = BatchesService.copo({ path: 'copo', batchId:vm.search.batchId, section: vm.search.section });
            }
        };

        vm.fetchCOPSODetails = ()=>{
            if( vm.search.batchId && vm.search.section ){
                vm.copsos = BatchesService.copso({ path: 'copso', batchId:vm.search.batchId, section: vm.search.section });
            }
        };

        vm.tabs = [{
            id: 'co-po',
            title: 'CO-PO',
            templateUrl: 'modules/batches/client/views/co-po.client.view.html',
            load: true
        },{
            id: 'co-pso',
            title: 'CO-PSO',
            templateUrl: 'modules/batches/client/views/co-pso.client.view.html',
            load: false
        }];

        var activeTab = vm.tabs[0].id;

        vm.selectTab = function (tab) {
        if (!tab.load) {
            tab.load = true;
        }
        activeTab = tab.id;
        };

        vm.isActive = function (tab) {
        return tab === activeTab;
        }; 

        
        init();

        function init(){
          PosService.getProgramPOs({
             path: "program", 
             programId: programResolve._id
          }, (poList)=>{
              poList.forEach((po)=>{                
                vm.pos[po.name] = po.description;
              });
          }, (err)=>{
              alert("Unable to get PO List");
          });

          PsosService.getProgramPSOs({
             path: "program", 
             programId: programResolve._id
          },(psoList)=>{              
              psoList.forEach((pso)=>{                
                vm.psos[pso.name] = pso.description;
              });
          }, (err)=>{
              alert("Unable to get PSO List");
          });
         
        }

    }

}());