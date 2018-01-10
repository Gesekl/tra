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
  return ((this.provider !== 'local' && !this.updated) || validator.isEmail(email));
};

/**
 * Program Schema
 */
var ProgramSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Program name',
    trim: true
  },
  email: {
    type: String,
    unique:true,
    index: true,
    validate: [validateLocalStrategyEmail, 'Please fill a valid email address'],
    required: 'Please fill Program E-Mail contact ',
    trim: true
  },
  contact:{
    type: String,
    unique:true,
    required:'Please fill Program Contact number'
  },
  fax:{
    type: String,
    unique:true,
    required:'Please fill Fax number'
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  college: {
    type: Schema.ObjectId,
    ref: 'College'
  },
  mappedUserId: {
    type: String
  }
});

mongoose.model('Program', ProgramSchema);
