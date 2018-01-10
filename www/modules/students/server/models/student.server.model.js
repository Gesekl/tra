'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  validator = require('validator'),
  Schema = mongoose.Schema;

/**
 * A Validation function for local strategy email
 */
var validateLocalStrategyEmail = function (email) {
  return  validator.isEmail(email);
};

/**
 * Student Schema
 */
var StudentSchema = new Schema({
  firstName: {
    type: String,
    default: '',
    required: 'Please fill First name',
    trim: true
  },
  lastName: {
    type: String,
    default: '',
    required: 'Please fill Last name',
    trim: true
  },
  name: {
    type: String,
    default: '',
    trim: true
  },
   parentName: {
    type: String,
    default: '',
    trim: true
  },

  contact: {
    type: String,
    default: '',
    required: 'Please fill Student contact',
    trim: true
  },
  email: {
    type: String,
    unique: true,
    index: true,
    required: 'Email is required',
    validate: [validateLocalStrategyEmail, 'Please fill a valid email address'],
    trim: true
  },
  parentEmail: {
    type: String,
    unique: true,
    index: true,
    required: 'Email is required',
    validate: [validateLocalStrategyEmail, 'Please fill a valid email address'],
    trim: true
  },
  usn: {
    type: String,
    unique: true,
    index: true,
    required: 'Please fill Student USN',
    trim: true
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
  created: {
    type: Date,
    default: Date.now
  },
  program: {
    type: Schema.ObjectId,
    ref: 'Program'
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  mappedUserId: {
    type: String
  },
  mappedUserIdForParent: {
    type: String
  }
});

mongoose.model('Student', StudentSchema);
