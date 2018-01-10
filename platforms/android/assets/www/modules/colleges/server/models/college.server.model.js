'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * College Schema
 */
var CollegeSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill College name',
    unique: true,
    trim: true
  },
  collegeId: {
    type: String,
    default: '',
    required: 'Please fill College ID',
    unique: true,
    index: true,
    trim: true
  },
  contact : {
    type: String,
    default: '',
    required: 'Please fill College contact',
    trim: true
  },
  email: {
    type: String,
    default: '',
    required: 'Please fill College email',
    unique: true,
    index: true,
    trim: true
  },
  address: {
    type: String,
    default: '',
    required: 'Please fill College address',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  mappedUserId: {
    type: String
  }
});

mongoose.model('College', CollegeSchema);