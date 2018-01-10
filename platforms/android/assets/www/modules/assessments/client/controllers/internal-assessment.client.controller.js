(function () {
  'use strict';

  angular
    .module('assessments')
    .controller('InternalAssessmentController', InternalAssessmentController);

  InternalAssessmentController.$inject = ['$scope', '$http','$state', '$window', 'Authentication', 'AssessmentsService', 'BatchesService', 'LecturesSubjectsService','SubjectsService','toaster'];

  function InternalAssessmentController($scope, $http, $state, $window, Authentication, AssessmentsService, BatchesService, LecturesSubjectsService, SubjectsService,toaster )  {
    var vm = this;

    vm.search = { batchId: '', section: '', subjectId: '',ia:'' };
    vm.allLectureSubjects = LecturesSubjectsService.query();
    vm.subjects = [];
    vm.batches = BatchesService.batches({ 'path': 'lectures'});   
    vm.sections = ['A','B','C','D','E','F'];
    vm.ias=[];
     vm.iash=[];
    vm.assessments = [];
    // subject - get questions
    vm.subject = {};
    // map for faster access to IA & Questions
    vm.questions = {};

    // for easier access in UI
    vm.allStudentAssessment = {};

    //export assessment pdf
    
     vm.exportToPdf = ()=>{
      
       let qno=[];
       vm.subject.assessment.forEach((ob)=>{
        let qob='CO - ' + ob.co.substring( ob.co.indexOf(".") + 1 ) + '\nQ - '+ob.qno+'\nM - '+ob.marks+'';
         qno.push(qob);
       });
        qno.shift();
     
        
      let assHeader  = [ 'Name', 'USN', ...qno];
              let assBody = vm.assessments.map((ass)=>{
              let assDetails=[];
              let marks=vm.subject.assessment[0].marks;
              let tot=0;                      
            
             ass.assessment.forEach(function(ob){
               assDetails.push(ob.score);
              })
              assDetails.forEach(function(totmarks){
                tot+=totmarks;
              })
              return [
                  ass.student.name,
                  ass.student.usn, 
                  ...assDetails                    
              ];
          });
          
         
          pdfMake.createPdf({content:[
            	{ text: 'Assessments', style: 'header' },             
             {
                  table: {
                    body: [
                      assHeader,
                      ...assBody         
                    ]
                  }
              }          
          ],		
          styles: {
                      header: {
                        fontSize: 8,
                        bold: true,
                        margin: [0, 0, 0, 10]
                      },
                      subheader: {
                        fontSize: 8,
                        bold: true,
                        margin: [0, 10, 0, 5]
                      },
                      tableExample: {
                        margin: [0, 5, 0, 15]
                      },
                      tableHeader: {
                        bold: true,
                        fontSize: 8,
                        color: 'black'
                      }
            }, defaultStyle: {
                fontSize: 8
              }
          }).open();
        };


    // import assessment details
    vm.import = (event)=>{
      var target = event.srcElement || event.target;
			
			if ( target && target.files && target.files.length === 1) {
				var fileObject = target.files[0];
        let reader = new FileReader();
        reader.onloadend = function () {          
          let stdAssessmentList = $.csv.toObjects(reader.result);
          stdAssessmentList.forEach(( assessment, index )=>{
             
             if( vm.allStudentAssessment[assessment.USN]){
                // check whether student has any assessment deails, if not create empty object
                if(!vm.allStudentAssessment[assessment.USN].assessment[ vm.search.ia ]){
                  vm.allStudentAssessment[assessment.USN].assessment[ vm.search.ia ] = {};
                }                
                // iterate through all questions and import student marks to student assessment
                Object.keys( vm.questions[vm.search.ia] ).forEach((qno)=>{
                     
                    if( !vm.allStudentAssessment[assessment.USN].assessment[ vm.search.ia ][qno] ){
                      // copy the questions deails to student assessment and later just update the score
                      // storing all questions details and store help in computation
                      vm.allStudentAssessment[assessment.USN].assessment[ vm.search.ia ][qno] =  Object.assign({}, vm.questions[vm.search.ia][qno]);
                    }
                    // Update the score and refresh the changes in UI by broadcasting
                    $scope.$apply(function() {
                       $scope.vm.allStudentAssessment[assessment.USN].assessment[ vm.search.ia ][qno].score = Number( assessment[ 'Q' + qno ]);
                    });                    
                  
                });
                
             }
          });
          target.form.reset();
        };
        reader.readAsBinaryString( fileObject );       
			}
    };

    vm.getCODescription = (coId)=>{
      let filteredCOS = vm.subject.cos.filter((co)=>{
          return co.code == coId;
      });
      return filteredCOS[0];
    }

    vm.getTotalScore = ( assessmentObj )=>{
        let totalScore = 0;
        if( assessmentObj ){ 
          Object.keys( assessmentObj ).forEach((q)=>{
              if( assessmentObj[q].score ){
                totalScore += assessmentObj[q].score;
              }
           });
        }

        return totalScore;
    };
      vm.onIAChanges = ()=>{
        SubjectsService.get({ subjectId: vm.search.subjectId }, ( subject )=>{
          vm.subject = subject;
          console.log('subjectsslist:-'+JSON.stringify(vm.subject));
          if( subject.assessment.length > 0 ) {              
              subject.assessment.forEach((question)=>{
               
                 if (!vm.questions[question.ia]){
                   vm.questions[question.ia] = {};
                 }
                 vm.questions[question.ia][question.qno] = question;
              });
          } 
          
          if( vm.questions[vm.search.ia] ){
            AssessmentsService.fetchAssessments( vm.search, ( res )=>{
                vm.assessments = res;
                vm.allStudentAssessment = {};
                // iterate through each student assessment details
                vm.assessments.forEach((assessment)=>{
                    let tmp = Object.assign({}, assessment );
                    tmp.assessment = {};
                    if( assessment.assessment ){
                      assessment.assessment.forEach((question)=>{   
                          if( !tmp.assessment[question.ia]){
                            tmp.assessment[question.ia] = {};
                          }
                          tmp.assessment[question.ia][question.qno] = Object.assign({},  question, vm.questions[question.ia][question.qno]);
                      });
                    }
                    vm.allStudentAssessment[tmp.student.usn] = tmp;                
                });
            });
          }
        });
       

      };
 
    vm.onSubjectChange = ()=>{
        vm.reset();
        SubjectsService.get({ subjectId: vm.search.subjectId }, ( subject )=>{
          vm.subject = subject;
          // ia list for dropdown
          vm.ias=[];
          vm.subject.assessment.forEach(function(obj){
             vm.ias.push(obj.ia);
          })
          
        });
       
    };

    vm.onSectionChange = ()=>{
       vm.reset();
       vm.search = Object.assign({}, vm.search, { subjectId: '' });
       vm.subjects = vm.allLectureSubjects.filter((sub)=>{
         return vm.search.batchId === sub.batch._id && vm.search.section === sub.section;
       });
    };

    vm.onBatchChange = ()=>{
       vm.reset();
       vm.search = Object.assign({}, vm.search, { section: '', subjectId: '' });
       vm.subjects = [];
    };

    vm.reset = ()=>{
        vm.assessments = [];
          // subject - get questions
        vm.subject = {};
        // map for faster access to IA & Questions
        vm.questions = {};
        // for easier access in UI
        vm.allStudentAssessment = {};
    };

    vm.filterAssessmentByStudent = ( item )=>{        
        return !vm.studentFilter || ( item.student.usn.toLowerCase().indexOf( vm.studentFilter.toLowerCase() ) > -1 || item.student.name.toLowerCase().indexOf( vm.studentFilter.toLowerCase() ) > -1 );
    };

    vm.validateMaxMarks = (obj, field )=>{
        if( ( obj[field] > obj.marks ) || ( obj[field] < 0 ) ){
            obj[field] = "";
        }
    };
   
    vm.saveOrUpdate = ()=>{
      vm.assessments.forEach((assessment)=>{
          let studentAssessment = vm.allStudentAssessment[assessment.student.usn];
          let updatedAssessment = [];
          vm.subject.assessment.forEach((question)=>{
              if(  studentAssessment.assessment[question.ia] ){
                let obj = Object.assign({}, vm.questions[question.ia][question.qno], studentAssessment.assessment[question.ia][question.qno]);
                updatedAssessment.push( obj );
              }
          });
          assessment.assessment = updatedAssessment;         
       });
       AssessmentsService.updateAssessments({ 'path': 'all'}, vm.assessments, (res)=>{
          toaster.pop('success', "Assessment", "Assessments Updated Successfully!!");
         // get updated date including assessment id which help to further updates issues
         vm.onSubjectChange();
       }, (err)=>{
          toaster.pop('error', "Assessment", "Unable to update assessments!!");
       });      
    };
  }
}());
