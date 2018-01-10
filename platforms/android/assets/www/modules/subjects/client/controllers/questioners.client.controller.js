(function(){
    'use strict';

    angular
        .module('subjects')
        .controller('SubjectsQuestionersController', SubjectsQuestionersController);

    SubjectsQuestionersController.$inject = ['$scope', '$state', '$window', 'Authentication','SubjectsService', 'subjectResolve','toaster','Upload','FileSaver','Blob','$sce'];

    /** @ngInject */
    function SubjectsQuestionersController($scope, $state, $window, Authentication,SubjectsService, subject,toaster,Upload,FileSaver,Blob,$sce){
        var vm = this;

        vm.subject = subject;
        vm.levels = [1,2,3,4,5,6];
        // vm.ias = ['IA_1','IA_2','IA_3','EA'];
        // vm.ia = 'IA_1';
        vm.onIAChange = onIAChange;
        // vm.addNewQuestion = addNewQuestion;
        vm.questions = [];
        vm.saveQuestions = saveQuestions;
        vm.showContent = showContent;
        vm.resume=resume;
        //vm.download=download;
         vm.fileData;
      
        function saveQuestions(){
             if(!vm.subject.assessment){
                vm.subject.assessment = [];
            }
            vm.subject.assessment.push({            
                ia: vm.ia,
                fileId:vm.fileData.id,
                filename:vm.fileData.filename
            });
            onIAChange();
           
            vm.subject.$update((res)=>{
                  toaster.pop('success', "Quesions", "Questions Updated Successfully!!");
              }, (error)=>{
                 toaster.pop('error', "Quesions", "Unable to save Questions!!");
               });
        }

        let defaultExternalAssessment = ()=>{
            let equestions = vm.subject.assessment.filter((question)=>{
                return question.ia === 'EA';
            });
            if( equestions.length  === 0 ){
                vm.subject.assessment.push({
                    qno: 1,
                    ia: 'EA',
                    marks: 100,
                    co: vm.subject.name
                });
            }
        };

        function onIAChange(){
            if( vm.subject.assessment ) {
                vm.questions = vm.subject.assessment.filter((question)=>{
                    return ( question.ia === vm.ia );
                });                            
            }
            
        }
        // CREATED BY VEDA
        function resume($files){
            if ($files && $files.length) {
                var file = $files[0];
                console.log('file type:'+file.type);
                Upload.upload({
                    url: '/api/subjects/fileUpload',
                    file:$files[0]
                  //  data: {file:vm.assessment.file}
            }) .success(function (data) {
               toaster.pop('success', "File", "file updated Successfully!!");
            vm.fileData = {id:data._id,filename:data.filename};
             

                       }).error(function (err) {
                  console.log('err'+err);
                  toaster.pop('warning', "File", "Unable to update Subjects!!");
                });
            }
        }


  vm.download = function() {

     var config = {      
            //SET responseType
            responseType: 'blob',
            headers: {
                'Accept': "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                "Content-Type": "application/json"
               
             }};
        SubjectsService.fileDownload({ path:'fileDownload',fileId:'59ad28f096d960d81264b0a2'},config,
    
       (res) => {
       
        console.log("data"+JSON.stringify(res));
    var data = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
     console.log("dara"+JSON.stringify(data));
     
    FileSaver.saveAs(data, 'text');
    
   
       });
  }

         // created by santhu
        vm.fileData;
         function showContent ($fileContent){
        var content = $fileContent;
        vm.fileData = content;
        };

      
        init();

        function init(){
            defaultExternalAssessment();   
            onIAChange();
        }

    }
     angular
        .module('subjects').directive('onReadFile', function ($parse) {
    return {
        restrict: 'A',
        scope: false,
        link: function(scope, element, attrs) {
            var fn = $parse(attrs.onReadFile);
            
            element.on('change', function(onChangeEvent) {
                var reader = new FileReader();
                
                reader.onload = function(onLoadEvent) {
                    scope.$apply(function() {
                        fn(scope, {$fileContent:onLoadEvent.target.result});
                    });
                };

                reader.readAsText((onChangeEvent.srcElement || onChangeEvent.target).files[0]);
            });
        }
    };
});

}());