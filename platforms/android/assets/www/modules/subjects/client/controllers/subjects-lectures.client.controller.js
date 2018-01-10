(function () {
    'use strict';

    angular
        .module('subjects')
        .controller('SubjectsToLecturesController', SubjectsToLecturesController);

    SubjectsToLecturesController.$inject = ['SubjectsService', 'BatchesService', 'LecturesService','toaster'];

    /** @ngInject */
    function SubjectsToLecturesController(SubjectsService, BatchesService, LecturesService,toaster) {
        var vm = this;
        vm.batches = BatchesService.query(); // fetch all batches for the program
        vm.lectures = LecturesService.query(); // fetch all lectures for the program
        vm.sections = ['A', 'B', 'C', 'D', 'E', 'F'];
        vm.semesters = [ 1 ,2 ,3 ,4 ,5 ,6 ,7 ,8 ];
        

        vm.assignLectureToSubject = assignLectureToSubject;
        vm.search = { batchId: '', section: '' };
        vm.onChangeOptions = onChangeOptions;

        vm.exportToPdf = ()=>{
          let Header  = [ 'Subject Code', 'Subject Name','Lecturer'];
           
            let Body = vm.subjects.map((subObj)=>{
             let lectureName = null;
             if(subObj.lecture == null){
                       lectureName = '-';
              }
            vm.lectures.forEach(function(lecObj){
                   if(lecObj._id == subObj.lecture){
                        lectureName = lecObj.name;
                   }
             });
            
              return [
                  subObj.subjectCode,
                  subObj.name,
                  lectureName                
              ];
          });
                   
          pdfMake.createPdf({content:[
             { text: 'Subject Allocation', style: 'header' },              
             {
                  table: {
                    widths: [ 100, 100, 100 ],
                    body: [
                      Header,
                      ...Body                        
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

        function assignLectureToSubject(subject) {
            var result = subject.$update();
            result.then(function(data){
               toaster.pop('success', "Subjects", "Subject Assigned to Lecturer Successfully.!!");
                     },function(error){
                        toaster.pop('error', "Subjects", "Unable to Assigned to Lecturer!!");
                            // alert(error);
                        });
        }

        function onChangeOptions() {
            if (vm.search.batchId && vm.search.section) {
                vm.subjects = SubjectsService.query(vm.search);
                vm.subjects.$promise.then( function( data ){
                     vm.subjects = data.filter(function( subObj ){
                            return subObj.semester == vm.search.semester;
                     });
                });
              }
        }

        init();

        function init() {
        }

    }

} ());