'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Batch Schema
 */
var BatchSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Batch name',
    trim: true
  },
  program: {
    type: Schema.ObjectId,
    ref: 'Program'
  },
   sdate:{
   type:Date,
   required:'Please fill Start Date'
 },
 edate:{
   type:Date,
   required:'Please fill Etart Date'
 },
 nor:{
   type:Number,
   required:'Please fillNumber Of Students'
 },
  system: {
    type: String,
    enum: ['Credit', 'Standard'],
    default: 'Standard',
    required: 'Please select System'
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Batch', BatchSchema);
