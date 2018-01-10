(function () {
  'use strict';

  angular
    .module('assessments')
    .controller('SubjectAttainmentsController', SubjectAttainmentsController);

  SubjectAttainmentsController.$inject = ['$scope', '$http','$state', '$window', 'AttainmentsService', 'Authentication', 'AssessmentsService', 'BatchesService', 'LecturesSubjectsService','SubjectsService'];

  function SubjectAttainmentsController($scope, $http, $state, $window, AttainmentsService, Authentication, AssessmentsService, BatchesService, LecturesSubjectsService, SubjectsService )  {
    var vm = this;

    vm.search = { batchId: '', section: '', subjectId: '', ia: 'IA_1', level: "1" };
    vm.allLectureSubjects = LecturesSubjectsService.query();
    vm.subjects = [];
    vm.batches = BatchesService.batches({ 'path': 'lectures'});   
    vm.sections = ['A','B','C','D','E','F'];
    vm.ias = ['IA_1','IA_2','IA_3','EA'];
    vm.attainmentLevels = [1,2,3];
    vm.assessments = [];
    // subject - get questions
    vm.subject = {};
    // map for faster access to IA & Questions
    vm.questions = {};

    // for easier access in UI
    vm.allStudentAssessment = {};
    vm.questionAttainment = {};
    vm.subjectAttainment = {};
    // IA #, qno is requied
    // compute and store attainment for each question
    vm.calculatQuestionAttainment = ( )=>{
      vm.questionAttainment = {};
       for( let key in vm.allStudentAssessment ){
           vm.subject.assessment.forEach((question)=>{
              
              if( vm.allStudentAssessment[key].assessment[question.ia] && vm.allStudentAssessment[key].assessment[question.ia][question.qno]){
                // get attainment level result
                let result = vm.allStudentAssessment[key].assessment[question.ia][question.qno]['al' + vm.search.level ] ;
                if( !vm.questionAttainment[ question.ia ]){
                  vm.questionAttainment[ question.ia ] = {};                
                }
                if( !vm.questionAttainment[ question.ia ][question.qno ]){
                  vm.questionAttainment[ question.ia ][question.qno ] = { 'Yes': 0, 'No': 0, 'result': 0, count: 0, 'co': ''  };
                }
                
                if( result == 'Yes'){
                   vm.questionAttainment[ question.ia ][question.qno ].Yes = Number( vm.questionAttainment[ question.ia ][question.qno ].Yes ) + 1;
                }else if( result == 'No' ){                   
                   vm.questionAttainment[ question.ia ][question.qno ].No = Number( vm.questionAttainment[ question.ia ][question.qno ].No ) + 1;
                }
               // console.log(question.qno, yesCount, noCount, yesCount+noCount)
                vm.questionAttainment[ question.ia ][question.qno ].co = question.co;
                vm.questionAttainment[ question.ia ][question.qno ]['result'] = (  vm.questionAttainment[ question.ia ][question.qno ].Yes / (  vm.questionAttainment[ question.ia ][question.qno ].Yes +  vm.questionAttainment[ question.ia ][question.qno ].No )).toFixed(3);
              }
           });           
       }
        
    }
    
   
    let getAllAttainmentStatus = ( studentQAndA )=>{
        let attainment = { };
        if( studentQAndA.score && studentQAndA.ia === 'EA'){
          vm.subject.attainment.eaLevels.forEach((level,index)=>{
              let eMarks = ( level.marks_pct / 100 ) * studentQAndA.marks;
              attainment['al' + ( index + 1 )] = ( studentQAndA.score >= eMarks )? 'Yes': 'No';
          })          
        }else if( studentQAndA.score ) {
          vm.subject.attainment.iaLevels.forEach((level,index)=>{
              let eMarks = ( level.marks_pct / 100 ) * studentQAndA.marks;
              attainment['al' + ( index + 1 )] = ( studentQAndA.score >= eMarks )? 'Yes': 'No';
          })     
        }  
        return attainment;
    }
    

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

    vm.onSubjectChange = ()=>{
        vm.reset();
        AttainmentsService.get( { path: 'subject', subjectId: vm.search.subjectId }, ( attainment )=>{
            vm.subjectAttainment = attainment;
            console.log( vm.subjectAttainment );
        });

        SubjectsService.get({ subjectId: vm.search.subjectId }, ( subject )=>{
          vm.subject = subject;
          // questions mapping for later access
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
                vm.assessments.forEach(( assessment )=>{
                    let tmp = Object.assign({}, assessment );
                    tmp.assessment = {};
                    if( assessment.assessment ){
                      // all students questions marks and question details will be stored in assessment
                      assessment.assessment.forEach((question)=>{   
                          if( !tmp.assessment[question.ia]){
                            tmp.assessment[question.ia] = {};                        
                          }
                          // each question score, marks and details avaliable
                          // compute the whether attainment is met or not
                          tmp.assessment[question.ia][question.qno] = Object.assign({},  question, vm.questions[question.ia][question.qno]);   
                          tmp.assessment[question.ia][question.qno] = Object.assign({},  tmp.assessment[question.ia][question.qno], getAllAttainmentStatus( question ));                             
                      });
                    }
                    vm.allStudentAssessment[tmp.student.usn] = tmp;                
                });   
                vm.calculatQuestionAttainment();
            });
          }
        });
       
    };

  // calculate attainments
 
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

        // reset attainment details
        vm.subjectAttainment = {};
    };

    vm.filterAssessmentByStudent = ( item )=>{        
        return !vm.studentFilter || ( item.student.usn.toLowerCase().indexOf( vm.studentFilter.toLowerCase() ) > -1 || item.student.name.toLowerCase().indexOf( vm.studentFilter.toLowerCase() ) > -1 );
    };
  }
}());
