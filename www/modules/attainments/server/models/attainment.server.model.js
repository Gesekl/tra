'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Attainment Schema
 */
var AttainmentSchema = new Schema({
 
  created: {
    type: Date,
    default: Date.now
  },
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
  ia: {
    
  },
  ea: {
    
  },
  iaAl: {
    type: Number,
    default: 0
  },
  eaAl: {
    type: Number,
    default: 0
  },
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
    PSO3: Number
  },
  subject: {
    type: Schema.ObjectId,
    ref: 'Subject'
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

AttainmentSchema.statics.getAttainmentForSubjects = function( subjectIds, cb){
    return this.find({ subject: { $in: subjectIds } })
               .sort("-subject")
               .populate("subject","name subjectCode semester")
               .populate("batch","name")               
               .exec(cb);
};

mongoose.model('Attainment', AttainmentSchema);
