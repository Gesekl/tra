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
  return validator.isEmail(email);
};

/**
 * Lecture Schema
 */
var LectureSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Lecture name',
    trim: true
  },
  firstName: {
    type: String,
    default: '',
    required: 'Please fill Lecture firstname',
    trim: true
  },

lastName: {
    type: String,
    default: '',
    required: 'Please fill Lecture lastname',
    trim: true
  },
   skills: {
    type: String,
    default: '',
    required: 'Please fill Lecture skills',
    trim: true
  },
   qualification: {
    type: String,
    default: '',
    required: 'Please fill Lecture qualification',
    trim: true
  },
   designation: {
    type: String,
    default: '',
    required: 'Please fill Lecture designation',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  contact: {
    type: String,
    default: '',
    required: 'Please fill Lecture contact',
    trim: true
  },
  email: {
    type: String,
    unique: true,
    index: true,
    required: 'Email is required',
    trim: true,
    validate: [validateLocalStrategyEmail, 'Please fill a valid email address']
  },
  employeeId: {
    type: String,
    default: '',
    required: 'Please fill Lecture Id',
    trim: true,
    unique : true,
    index: true
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
    type:String
  }
});

mongoose.model('Lecture', LectureSchema);
