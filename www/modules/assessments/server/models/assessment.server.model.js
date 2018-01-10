'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Assessment Schema
 */
var AssessmentSchema = new Schema({
  batch: {
    type: Schema.ObjectId,
    ref: 'Batch'
  },
  section: {  
    type: String,
    enum: [ 'A', 'B', 'C', 'D', 'E', 'F'],    
    default: 'A',
    required: 'Please select subject section' 
  },
  subject: {
    type: Schema.ObjectId,
    ref: 'Subject'
  },
  student: {
    type: Schema.ObjectId,
    ref: "Student"
  },
  created: {
    type: Date,
    default: Date.now
  },
  assessment: [      
	  {
      qno: Number,      
      marks: Number,
      level: Number,
      co: String,
      score: Number,
      ia: { 
        type: String
       // enum: [ 'IA_1', 'IA_2', 'IA_3','EA'],   
       // default: 'IA_1'
      }
    }
 ],
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

/**
 * Get all student assessment
 */
AssessmentSchema.statics.getStudentAssessment = function( studentId, cb ){
  return this.aggregate([
      {
        $match: {
          "student": mongoose.Types.ObjectId( studentId )
        }
      }, 
      { "$unwind": "$assessment"},
      { 
        "$match": {"assessment.score":{ $ne : null}}
      },
      {
        $group: {
          _id: {
            subject: "$subject",
            ia: "$assessment.ia",				
          },
          score: { $sum: "$assessment.score" }
        }
      },
      {
          $group: {	
              _id: {
                  subject: "$_id.subject"
              },
              assessment: {
                  "$push": {
                    "type": "$_id.ia",
                    "score": "$score"
                }
              }
          }
      },
      {
      "$project":{
          _id: 0,
          subject: "$_id.subject",
          assessment: 1
        }
      }	  
  ], cb );
};
/**
 * get attainment level( all three )
 */
AssessmentSchema.statics.getAttainmentLevel = function( query , cb) {   
      if( !query.match )  {
          query.match = {
                      "batch": mongoose.Types.ObjectId( query.batchId ),
                      "section": `${query.section}`,
                      "subject": mongoose.Types.ObjectId( query.subjectId )
         };
      }
      if( query.attainmentLevels && query.attainmentLevels.length === 3 ){
            let atl1 = query.attainmentLevels[0], atl2 = query.attainmentLevels[1], atl3 = query.attainmentLevels[2];
            return this.aggregate([
                { 
                    "$match": query.match
                },
                { "$unwind": "$assessment"},
                { 
                  "$match": {"assessment.score":{ $ne : null}}
                },
                {
                    $project: {
                      "subject": 1,
                      "assessment": {
                        qno: 1,
                        marks: 1,
                        score: 1,
                        co: 1,
                        ia: 1,
                        group: { $cond: [ { $eq: [ "$assessment.ia", "EA" ] }, "EA", "IA" ] },
                        alp1: { $cond: [ { $gte: [ "$assessment.score",  { $multiply: ["$assessment.marks", ( atl1.marks_pct/100 )]} ] }, 1, 0 ] },
                        alf1: { $cond: [ { $lt: [ "$assessment.score", { $multiply: ["$assessment.marks", ( atl1.marks_pct/100 )]} ] }, 1, 0 ] },
                        alp2: { $cond: [ { $gte: [ "$assessment.score", { $multiply: ["$assessment.marks", ( atl2.marks_pct/100 )]} ] }, 1, 0 ] },
                        alf2: { $cond: [ { $lt: [ "$assessment.score", { $multiply: ["$assessment.marks", ( atl2.marks_pct/100 )]} ] }, 1, 0 ] },
                        alp3: { $cond: [ { $gte: [ "$assessment.score", { $multiply: ["$assessment.marks", ( atl3.marks_pct/100 )]} ] }, 1, 0 ] },
                        alf3: { $cond: [ { $lt: [ "$assessment.score", { $multiply: ["$assessment.marks", ( atl3.marks_pct/100 )]} ] }, 1, 0 ] },
                      }
                    }
                },
                {
                    $group: {
                      _id: { 			 
                        subject: "$subject",
                        qno: "$assessment.qno",
                        co: "$assessment.co",
                        group: "$assessment.group",
                        ia: "$assessment.ia"
                      },
                      alp1: { $sum: "$assessment.alp1" },			
                      alf1: { $sum: "$assessment.alf1" },
                      alp2: { $sum: "$assessment.alp2" },			
                      alf2: { $sum: "$assessment.alf2" },
                      alp3: { $sum: "$assessment.alp3" },			
                      alf3: { $sum: "$assessment.alf3" }
                    }		
                  }, {
                    $group: {
                      _id: {
                        subject: "$_id.subject",
                        ia: "$_id.ia",
                        qno: "$_id.qno",
                        co: "$_id.co",
                        group: "$_id.group",
                        al1: { $multiply: [ { $divide: [ "$alp1", { $add: [ "$alp1", "$alf1"] }]}, 100 ] },
                        al2: { $multiply: [ { $divide: [ "$alp2", { $add: [ "$alp2", "$alf2"] }]}, 100 ] },
                        al3: { $multiply: [ { $divide: [ "$alp3", { $add: [ "$alp3", "$alf3"] }]}, 100 ] }
                      }
                      
                    }	 
                  }, {
                    $group: {
                      _id: {				
                        subject: "$_id.subject",
                        co: "$_id.co",
                        group: "$_id.group"				
                      },
                      al1: { $avg: "$_id.al1" },
                      al2: { $avg: "$_id.al2" },			
                      al3: { $avg: "$_id.al3" }			
                    }	 
                  },
                  // {
                  //   $group: {
                  //     _id: {
                  //       id: "$_id.group",
                  //       subject: "$_id.subject"
                  //     },
                  //     al1: { $avg: "$al1" },
                  //     al2: { $avg: "$al2" },
                  //     al3: { $avg: "$al3" },
                  //   }
                  // }
            ], cb );
      }else {
        cb( { message: 'Not able to find attainment level with given details'});
      }
     
 };



/**
 * Get Attainment Level for student
 */
AssessmentSchema.static.getStudentAttainmentLevel = function( query, cb ){
      let match = {
              "batch": mongoose.Types.ObjectId( query.batchId ),
              "section": `${query.section}`,
              "subject": mongoose.Types.ObjectId( query.subjectId ),
              "student": mongoose.Types.ObjectId( query.studentId )
          }; 
      query.match = match;         
      return this.getAttainmentLevel( query, cb );
};

mongoose.model('Assessment', AssessmentSchema);
