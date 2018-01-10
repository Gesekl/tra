'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  College = mongoose.model('College'),
  User = mongoose.model("User"),
  async = require("async"),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  credential=require(path.resolve('./modules/users/server/controllers/users/users.sendcredentials.server.controller')),
  _ = require('lodash');

 
/**
 * Create a College
 */
exports.create = function(req, res) {
var pass=credential.randomPassword();
  var college = new College(req.body);
  college.user = req.user;
  let user = new User( User.getUserObject( {
      firstName: college.name,
      lastName: "-",
      email: college.email,
       password:pass,
      user: req.user,
      roles: ['college_admin','hod']
  }));
  async.series([
    function(callback){
      user.save((err)=>{
          if( err ) return callback(err);
          else callback();
      });
    },
    function(callback){
      college.mappedUserId = user._id;
      college.save((err, result )=>{
        if( err ) {
          user.remove(); // remove user if college creation fails
          return callback(err);
        }
        else callback();
      })
    }
  ],function(error){
      if( error ){
        console.log( error );
        return res.status(400).send({
           message: errorHandler.getErrorMessage(error)
        }); 
      }
      res.jsonp( college );
      credential.sendmail(college.email,pass);
  }); 
};

/**
 * Show the current College
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var college = req.college ? req.college.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  college.isCurrentUserOwner = req.user && college.user && college.user._id.toString() === req.user._id.toString();

  res.jsonp(college);
};

/**
 * Update a College
 */
exports.update = function(req, res) {
  var college = req.college;

  college = _.extend(college, req.body);

  college.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(college);
    }
  });
};

/**
 * Delete an College
 */
exports.delete = function(req, res) {
  var college = req.college;

  college.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(college);
    }
  });
};

/**
 * List of Colleges
 */
exports.list = function(req, res) {
  College.find().sort('-created').populate('user', 'displayName').exec(function(err, colleges) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(colleges);
    }
  });
};

/**
 * College middleware
 */
exports.collegeByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'College is invalid'
    });
  }

  College.findById(id).populate('user', 'displayName').exec(function (err, college) {
    if (err) {
      return next(err);
    } else if (!college) {
      return res.status(404).send({
        message: 'No College with that identifier has been found'
      });
    }
    req.college = college;
    next();
  });
};