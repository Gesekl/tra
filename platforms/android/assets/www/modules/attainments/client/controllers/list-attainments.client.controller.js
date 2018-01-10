(function () {
  'use strict';

  angular
    .module('attainments')
    .controller('AttainmentsListController', AttainmentsListController);

  AttainmentsListController.$inject = ['AttainmentsService', 'BatchesService', 'LecturesSubjectsService','SubjectsService','PosService','lectureResolve','PsosService', 'CsvFactory'];

  function AttainmentsListController(AttainmentsService, BatchesService, LecturesSubjectsService, SubjectsService, PosService, lectureResolve ,PsosService, CsvFactory ) {
      var vm = this;  

      vm.pos = {};
      vm.psos = {};
      vm.search = {};
      vm.posList = ['PO1','PO2','PO3','PO4','PO5','PO6','PO7','PO8','PO9','PO10','PO11','PO12'];
      vm.psosList = ['PSO1','PSO2','PSO3','PSO4','PSO5','PSO6'];
      

      vm.filterAttainment = (item)=>{         
         return ( !vm.search.attainment || JSON.stringify(item).toLowerCase().indexOf( vm.search.attainment.toLowerCase() ) > -1) ;
      };


       vm.tabs = [{
        id: 'co-po',
        title: 'PO Attainment',
        templateUrl: 'modules/attainments/client/views/co-po-tab-content.html',
        load: true
      },{
        id: 'co-pso',
        title: 'PSO Attainment',
        templateUrl: 'modules/attainments/client/views/co-pso-tab-content.html',
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

      vm.exportToCSV = ()=>{         
          CsvFactory.fn({ data: [], filename: 'attainment.csv'});
      };

      vm.downloadFile = ()=>{
          // console.log("downloadFile");
          // console.log('/api/assessments/attaimentsummary');
      };

      vm.exportToPdf = ()=>{
          let poHeader  = [ 'Subject', 'Code',  'IA', 'EA', ...vm.posList];
          let psoHeader  = [ 'Subject', 'Code',  'IA', 'EA', ...vm.psosList];
          let poBody = vm.attainments.map((att)=>{
              let poDetails = [];
              vm.posList.forEach((po)=>{  
                  if( att.pos[po] ){
                    poDetails.push( att.pos[po].toFixed(3) );
                  }else {
                    poDetails.push( "-");
                  }
              });
              return [
                  att.subject.name,
                  att.subject.subjectCode,                 
                  att.iaAl,
                  att.eaAl,
                  ...poDetails
              ];
          });
          let psoBody = vm.attainments.map((att)=>{
              let psoDetails = [];
              vm.psosList.forEach((pso)=>{  
                  if( att.psos[pso] ){
                    psoDetails.push( att.psos[pso].toFixed(3) );
                  }else {
                    psoDetails.push( "-");
                  }
              });
              return [
                  att.subject.name,
                  att.subject.subjectCode,                 
                  att.iaAl,
                  att.eaAl,
                  ...psoDetails
              ];
          });
         
          pdfMake.createPdf({content:[
            	{ text: 'PO Attainment', style: 'header' },              
             {
                  table: {
                    body: [
                      poHeader,
                      ...poBody         
                    ]
                  }
              }, 
              { text: ' ', style: 'header' },
              { text: 'PSO Attainment', style: 'header' },
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

     
      AttainmentsService.getAllSubAttainmentOfLecture({ path: 'lectures' }, (res)=>{
        vm.attainments = res;
      }, (err)=>{
        alert("Unable to Fetch Attainment Details for Subjects");
      });

       vm.getAttainmentPercentage = ( val )=>{
          if( val ){
            return "(" + ( ( val / 3 ) * 100 ).toFixed(0) + ")";
          }
          return "-";
      };

      init();

      function init(){
          PosService.getProgramPOs({
             path: "program", 
             programId: lectureResolve.program
          }, (poList)=>{
              poList.forEach((po)=>{                
                vm.pos[po.name] = po.description;
              });
          }, (err)=>{
              alert("Unable to get PO List");
          });

          PsosService.getProgramPSOs({
             path: "program", 
             programId: lectureResolve.program
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
