'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Assessment = mongoose.model('Assessment'),
  Subject = mongoose.model("Subject"),
  Student = mongoose.model("Student"),
  Attainment = mongoose.model("Attainment"),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

  var getAggregatedCOPOs = ({ batchId, section, subject, oAttainment }, cb )=>{
  Subject.getAggregatedCOPOForBatchAndSubject( { batchId, section, subjectId: subject._id}, (err, coposArray )=>{
        if ( !err) {    
            let copos = {};
            coposArray.forEach((copo)=>{
                Object.keys(copo).forEach((key)=>{
                  if( copo[key]){                   
                    copos[key] =  (( copo[key] * ( oAttainment ) ) / 3 ).toFixed(3); 
                  }
                });
            });    
            cb( undefined, copos );
        }
  });
};

let getAggregatedCOPSOs = ({ batchId, section, subject, oAttainment }, cb )=>{
  Subject.getAggregatedCOPSOForBatchAndSubject( { batchId, section, subjectId: subject._id }, (err, copsosArray)=>{
        if ( !err) {              
            let copsos = {};
            copsosArray.forEach((copso)=>{
                Object.keys(copso).forEach((key)=>{
                  if( copso[key]){                    
                    copsos[key] = ( ( copso[key] * ( oAttainment ) ) / 3 ).toFixed(3);
                  }
                });
            });    
            cb( undefined, copsos );
        }
  });
};

let updateAttainmentLevelForSubject = ({ batchId, section, subject, iaAl, eaAl, iaResults, eaResults }, cb )=>{
    let oAttainment = ( iaAl * ( subject.attainment.weightage.ia / 100 ) ) + ( eaAl * ( subject.attainment.weightage.ea / 100 ) );
    console.log( iaAl, eaAl, oAttainment );
    getAggregatedCOPOs( {batchId, section, subject, oAttainment }, ( err, copos )=>{
        if( !err ){
          getAggregatedCOPSOs( { batchId, section, subject, oAttainment }, (err,copsos )=>{
            if( !err ){
             Attainment.update( { batch: batchId, section: section, subject: subject._id }, {
                batch: batchId,
                section: section,
                subject: subject._id,
                ia: iaResults,
                ea: eaResults,
                iaAl: iaAl,
                eaAl: eaAl,
                pos: copos,
                psos: copsos,
              }, {upsert: true }, (err, results)=>{
                    if( err ){
                      console.error("Unable to update attainment details", err );
                    }else {
                        console.log( "Results", results );
                    }
              });
            }
          });
        }
    });
};

let computeAtainmentLevel = ({ batchId, section, subjectId })=> {   

      Subject.findOne( { _id: subjectId }, (err, subject )=>{
            if( !err && subject.attainment.iaLevels && subject.attainment.iaLevels.length === 3 ){
                  let attainment = subject.attainment;
                  let attainmentLevels = [...subject.attainment.iaLevels ];
                  // Calculate IA Attainment
                  Assessment.getAttainmentLevel({ batchId, section, subjectId, attainmentLevels, type: 'IA' }, (err, results)=>{
                       
                      if( !err ){
                        console.log("IA Attainment:", results );
                         let iaResults = results.filter((result)=>{
                              return result._id.group === 'IA';
                         }).map((result)=>{
                           return {
                             co: result._id.co,
                             al1: result.al1,
                             al2: result.al2,
                             al3: result.al3,
                           };
                         });
                         let iaAggregated = iaResults.reduce(( prev, next)=>{
                            return {
                              al1: prev.al1 + next.al1,
                              al2: prev.al2 + next.al2,
                              al3: prev.al3 + next.al3
                            };
                         });
                         
                         iaAggregated = { 
                            al1: iaAggregated.al1 / iaResults.length ,
                            al2: iaAggregated.al2 / iaResults.length,
                            al3: iaAggregated.al3 / iaResults.length };
  
                         let iaAl = 0;
                         if( iaResults.length > 0 ){
                            attainment.iaLevels.forEach(( atn, index )=>{
                                if( iaAggregated['al'+ ( index + 1 ) ] >= atn.stds_pct ){
                                    iaAl = index + 1;
                                }
                            });   
                         }

                          // Calculate EA Attainment
                          let attainmentLevels = [...subject.attainment.eaLevels ];
                          Assessment.getAttainmentLevel({ batchId, section, subjectId, attainmentLevels, type: 'EA' }, (err, eaRes )=>{
                          
                            if( !err ){
                              console.log("EA Attainment:", eaRes );
                              //results[0];
                              let eaResults = eaRes.filter((result)=>{
                                    return result._id.group === 'EA';
                              }).map(( result )=>{
                                    return {
                                        co: result._id.co,
                                        al1: result.al1,
                                        al2: result.al2,
                                        al3: result.al3,
                                    };
                              });

                              let eaAl = 0;
                              if( eaResults.length > 0 ) {
                                  attainment.eaLevels.forEach(( atn, index )=>{
                                    if( eaResults[0]['al'+ ( index + 1 ) ] >= atn.stds_pct ){
                                        eaAl = index + 1;
                                    }
                                });   
                              }                         
                              updateAttainmentLevelForSubject({ batchId, section, subject, iaAl, eaAl, iaResults, eaResults });
                            }
                          });                      
                       
                      }
                  });
            }
      });    
       
};

/**
 * Create a Assessment
 */
exports.create = function(req, res) {
  var assessment = new Assessment(req.body);
  assessment.user = req.user;

  assessment.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(assessment);
    }
  });
};

/**
 * Show the current Assessment
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var assessment = req.assessment ? req.assessment.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  assessment.isCurrentUserOwner = req.user && assessment.user && assessment.user._id.toString() === req.user._id.toString();

  res.jsonp(assessment);
};

/**
 * Update a Assessment
 */
exports.update = function(req, res) {
  var assessment = req.assessment;

  assessment = _.extend(assessment, req.body);

  assessment.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(assessment);
    }
  });
};

/**
 * Delete an Assessment
 */
exports.delete = function(req, res) {
  var assessment = req.assessment;

  assessment.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(assessment);
    }
  });
};

/**
 * List of Assessments
 */
exports.list = function(req, res) {
  Assessment.find().sort('-created').populate('user', 'displayName').exec(function(err, assessments) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(assessments);
    }
  });
};

 
/**
 * Get student assessment details
 */
exports.getStudentAssessment = (req, res)=>{

    Assessment.getStudentAssessment(req.params.studentId , ( err, results )=>{
        if( err ){
          return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
          }); 
        }else {
          Assessment.populate( results, { path: "subject", select:'name subjectCode' }, (err, results)=>{
              if( err ){
                 return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                }); 
              }else {
             console.log('res..'+results);
                  let modifiedResults = results.map((std)=>{
                    let nstd = {};
                    let list=[];
                    nstd.assesmentlist=[];
                    nstd.totalscore=0;
                    nstd.name = std.subject.name;
                    nstd.subjectCode = std.subject.subjectCode;
                    std.assessment.forEach(( ass )=>{
                      nstd.totalscore+=ass.score;
                    nstd.assesmentlist.push(ass)
                  });
                  console.log(nstd);
                    return nstd;
                  }); 
                  res.jsonp( modifiedResults );
              }
          });         
                      
        }
    });
   
};

/**
 * Update all student assessments
 */
exports.updateAllAssessments = (req,res)=>{
  if( req.body ){
      let batchId, section, subjectId;
      req.body.forEach(( obj )=>{

           var assessment = Object.assign({},obj );
           assessment.user = req.user;
           batchId = assessment.batch;
           section = assessment.section;
           subjectId = assessment.subject;

           if( assessment._id ){
            Assessment.update({ _id: assessment._id }, assessment, { upsert: true }, function(err) {
                if (err) {
                  console.error("Unable to update Assessment:", err );
                } else {
                  computeAtainmentLevel( { batchId, section, subjectId });
                }
              });
           }else {
              new Assessment(assessment).save(function(err) {
                if (err) {
                  console.error("Unable to update Assessment:", err );
                } else {
                  computeAtainmentLevel( { batchId, section, subjectId });
                }
              });
           }            
      });     
     
      res.jsonp(req.body);
  }else {
    res.jsop([]);
  }
};


/**
 * Assessement for batch, subjectId, section
 */
exports.getAssessmentsFor = function(req, res) {
  console.log("Fetching Assessments For:", req.params.batchId, req.params.section, req.params.subjectId );
  Assessment.find({ batch: req.params.batchId, section: req.params.section, subject: req.params.subjectId })
    .sort('created')
    .populate('user', 'displayName')
    .populate('student','firstName usn')
    .exec(function(err, assessments) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          if( assessments.length === 0 ){
            Student.find({ batch: req.params.batchId, section: req.params.section })
                  .sort("usn")
                  .exec( ( err, students )=>{
                      if( err ){
                        return res.status(400).send({
                            message: errorHandler.getErrorMessage(err)
                        });
                      }else {
                        students.forEach(( std )=>{
                          assessments.push( {
                            student: std,
                            batch: std.batch,
                            section: std.section,
                            subject: req.params.subjectId
                          });
                        });
                        res.jsonp( assessments );
                        
                      }
                  });
              }else {
                res.jsonp(assessments);
               
              }
    }
  });  
};
// created by veda for assessment of all student
exports.getAssessmentsForStudent = function(req, res) {
  Assessment.find({ batch: req.params.batchId, section: req.params.section, subject: req.params.subjectId })
    .sort('created')
    .populate('user', 'displayName')
    .populate("student")
    .exec(function(err, assessments) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
              var assessmentlist=[];
             assessments.forEach(function(obj){
               var tot = 0;
               var ass={}
               var assess=[];
              // assess.push(obj.assessment[0].ia);
               ass.name=obj.student.firstName;
               ass.usn=obj.student.usn;
               
               ass.assesslist=assess;
              obj.assessment.forEach(function(data){
               tot+= data.score;
               var ias={};
               ias.ia=data.ia,
               ias.score=data.score;
               assess.push(ias);
               
              })
              ass.total=tot;
              assessmentlist.push(ass);
                
              
                  obj.total = tot; 
                  console.log('obj '+obj);
                  assessmentlist.push(obj);
             })
             console.log("vvvvvvvv8888"+JSON.stringify(assessmentlist));





          // if( assessments.length === 0 ){
          //   Student.find({ batch: req.params.batchId, section: req.params.section })
          //         .sort("usn")
          //         .exec( ( err, students )=>{
          //             if( err ){
          //               return res.status(400).send({
          //                   message: errorHandler.getErrorMessage(err)
          //               });
          //             }else {
          //               students.forEach(( std )=>{
          //                 assessments.push( {
          //                   student: std,
          //                   batch: std.batch,
          //                   section: std.section,
          //                   subject: req.params.subjectId
          //                 });
          //               });
          //               res.jsonp( assessments );
          //               //res.jsonp(assessmentlist);
          //             }
          //         });
          //     }else {
                res.jsonp(assessmentlist);
               
           //  }
   }
 });  

};

// end of assessment created veda
/**
 * Assessment middleware
 */
exports.assessmentByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Assessment is invalid'
    });
  }

  Assessment.findById(id).populate('user', 'displayName').exec(function (err, assessment) {
    if (err) {
      return next(err);
    } else if (!assessment) {
      return res.status(404).send({
        message: 'No Assessment with that identifier has been found'
      });
    }
    req.assessment = assessment;
    next();
  });
};
