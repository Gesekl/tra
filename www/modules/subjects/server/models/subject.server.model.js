'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Subject Schema
 */
var SubjectSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Subject name',
    trim: true
  },
  program: {
    type: Schema.ObjectId,
    ref: 'Program'
  },
  subjectCode: {
    type: String,
    default: '',
    required: 'Please fill Subject Code',
    trim: true 
  },
  semester: {
    type: Number,
    enum: [ 1,2,3,4,5,6,7,8],    
    default: 1,
    required: 'Please fill subject semester' 
  },
  created: {
    type: Date,
    default: Date.now
  },
  batch: {
    type: Schema.ObjectId,
    ref: 'Batch'
  },
  lecture: {
    type: Schema.ObjectId,
    ref: 'Lecture'
  },
  section: {  
    type: String,
    enum: [ 'A', 'B', 'C', 'D', 'E', 'F'],    
    default: 'A',
    required: 'Please select subject section' 
  }, 
  attainment: {
     weightage:{
          ia: Number,
          ea: Number
      },
      iaLevels: [{ stds_pct: Number, marks_pct: Number }],
      eaLevels: [{ stds_pct: Number, marks_pct: Number }]
  }, 
  syllabus: {
    type: String,
    default: '',
  },
  assessment: [      
	  {
      // myFile: String,
      fileId:String,
      filename:String,
      // level: Number,
      // co: String,
      ia: String,
       
    }
 ],
  cos:[
    {
      name: String,
      code: String,
      description: String,
      pos: {
        PO1: Number,
        PO2: Number,
        PO3: Number,
        PO4: Number,
        PO5: Number,
        PO6: Number,
        PO7: Number,
        PO8: Number,
        PO9: Number,
        PO10: Number,
        PO11: Number,        
        PO12: Number
      },
      psos: {
        PSO1: Number,
        PSO2: Number,
        PSO3: Number,
        PSO4: Number,
        PSO5: Number,
        PSO6: Number
      }
    }
  ],
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});


/**
 * Aggregate Class level CO PSO
 */
SubjectSchema.statics.getAggregatedCOPSOForBatch = function( {batchId, section, match }, cb) {
  if( !match ){
    match = {
        batch: mongoose.Types.ObjectId( batchId ),
        section: `${section}`      
    };
  }
  return this.aggregate([
    {
      $match:  match
    },{
      $unwind: "$cos"
    },{
        "$group": {
          _id: {
            _id: "$_id",					
            subject: "$name",
            subjectCode: "$subjectCode",
          },
          PSO1: { "$avg": "$cos.psos.PSO1" },
          PSO2: { "$avg": "$cos.psos.PSO2" },
          PSO3: { "$avg": "$cos.psos.PSO3" },
          PSO4: { "$avg": "$cos.psos.PSO4" },
          PSO5: { "$avg": "$cos.psos.PSO5" },
          PSO6: { "$avg": "$cos.psos.PSO6" },
          PSO7: { "$avg": "$cos.psos.PSO7" },
          PSO8: { "$avg": "$cos.psos.PSO8" },
          PSO9: { "$avg": "$cos.psos.PSO9" },
          PSO10: { "$avg": "$cos.psos.PSO10" },
          PSO11: { "$avg": "$cos.psos.PSO11" },
          PSO12: { "$avg": "$cos.psos.PSO12" },
         
        }
    },{
        "$project": {           
          PSO1: 1,
          PSO2: 1,
          PSO3: 1,
          PSO4: 1,
          PSO5: 1,
          PSO6: 1,
          PSO7: 1,
          PSO8: 1,
          PSO9: 1,
          PSO10: 1,
          PSO11: 1,
          PSO12: 1,
          subject: "$_id.subject",
          subjectCode: "$_id.subjectCode",
          _id: 0         
        }
    }
  ], cb);
};

/**
 * Aggregated CO PSO for subject and batch
 */
SubjectSchema.statics.getAggregatedCOPSOForBatchAndSubject = function( query, cb ){
    let match = {
        _id: mongoose.Types.ObjectId( query.subjectId ),
        batch: mongoose.Types.ObjectId( query.batchId ),
        section: `${query.section}` 
    };
    query.match = match;
    return this.getAggregatedCOPSOForBatch(query, cb);
};

/**
 *  Aggregated CO PO for batch
 */
SubjectSchema.statics.getAggregatedCOPOForBatch = function(query, cb) {
   if( !query.match ){
     query.match = {
          batch: mongoose.Types.ObjectId( query.batchId),
          section: `${query.section }`
      };
   }
    return this.aggregate([
      {
        $match: query.match
      },{
        $unwind: "$cos"
      },{
          "$group": {
            _id: {
              _id: "$_id",					
              subject: "$name",
              subjectCode: "$subjectCode",
            },
            PO1: { "$avg": "$cos.pos.PO1" },
            PO2: { "$avg": "$cos.pos.PO2" },
            PO3: { "$avg": "$cos.pos.PO3" },
            PO4: { "$avg": "$cos.pos.PO4" },
            PO5: { "$avg": "$cos.pos.PO5" },
            PO6: { "$avg": "$cos.pos.PO6" },
            PO7: { "$avg": "$cos.pos.PO7" },
            PO8: { "$avg": "$cos.pos.PO8" },
            PO9: { "$avg": "$cos.pos.PO9" },
            PO10: { "$avg": "$cos.pos.PO10" },
            PO11: { "$avg": "$cos.pos.PO11" },
            PO12: { "$avg": "$cos.pos.PO12" },
          }
      },{
          $project: {
            "subject": "$_id.subject",
            "subjectCode": "$_id.subjectCode",
            "_id": 0,
            "PO1":1,
            "PO2":1,
            "PO3":1,
            "PO4":1,
            "PO5":1,
            "PO6":1,
            "PO7":1,
            "PO8":1,
            "PO9":1,
            "PO10":1,
            "PO11":1,
            "PO12":1			
          }		
        }
     ], cb );
};


/**
 * Aggregated CO PSO for subject and batch
 */
SubjectSchema.statics.getAggregatedCOPOForBatchAndSubject = function(query, cb ){
    let match = {
        _id: mongoose.Types.ObjectId( query.subjectId ),
        batch: mongoose.Types.ObjectId( query.batchId ),
        section: `${query.section}` 
    };
    query.match = match;
    return this.getAggregatedCOPOForBatch(query, cb);
};
 
 /**
  * Get all subjects assigned to lectures
  */
SubjectSchema.statics.getAllLectureSubjects = function(query, cb){
  return this.find({ 'lecture': query.lecture})
             .populate("batch")
             .exec( cb );
};

mongoose.model('Subject', SubjectSchema);
