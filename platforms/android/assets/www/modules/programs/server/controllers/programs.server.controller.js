'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Program = mongoose.model('Program'),
  College = mongoose.model("College"),
  Pso = mongoose.model('Pso'),
  Po = mongoose.model('Po'),
  User = mongoose.model("User"),
  async = require("async"),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
   credential=require(path.resolve('./modules/users/server/controllers/users/users.sendcredentials.server.controller')),
  _ = require('lodash');


/**
 * Create a Program
 */
exports.create = function(req, res) {

  console.log('user role:'+req.user);
  var pass=credential.randomPassword();
  var program = new Program(req.body);
  program.user = req.user;
  
  let user = new User( User.getUserObject( {
      firstName: program.name,
      lastName: "-",
      email: program.email,
       password:pass,
      user: req.user,
      roles: ['hod']
  }));
  
  async.series([
    function(callback){
      College.findOne({ mappedUserId: req.user._id }, (error, result)=>{
          if( error ){
            return callback(error);
          }else {
            program.college = result;
            callback();
          }
      });
    },
    function(callback){
      user.save((err)=>{
          if( err ) return callback(err);
          else {
            console.log("User created for program", user._id );
            program.mappedUserId = user._id;
            callback();
          }
      });
    },
    function(callback){
      program.save((error)=>{
        if( error ){
          user.remove(); // remove on failure of creating program
          return callback(error);
        }else {
          console.log("New Program Created", program._id );
          // save default pos
          Po.addDefaultPOs( program );
          console.log("Default Program Outcome added to program");
          // save default psos
          Pso.addDefaultPSOs( program );     
          console.log("Default Program Specific Outcome added to program");
          callback();
        }
      });
    }
  ],function(error){
      if( error ){
          console.log( error );
          return res.status(400).send({
            message: errorHandler.getErrorMessage(error)
          }); 
      }
      res.jsonp( program );
       credential.sendmail(res,pass);
  });   
};

/**
 * Show the current Program
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var program = req.program ? req.program.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  program.isCurrentUserOwner = req.user && program.user && program.user._id.toString() === req.user._id.toString();

  res.jsonp(program);
};

/**
 * Update a Program
 */
exports.update = function(req, res) {
  var program = req.program;

  program = _.extend(program, req.body);

  program.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(program);
    }
  });
};

/**
 * Delete an Program
 */
exports.delete = function(req, res) {
  var program = req.program;

  program.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(program);
    }
  });
};

/**
 * List of Programs
 */
exports.list = function(req, res) {
  let collegeId = 0;
  let programs = [];
  async.series([
    function(callback){
        College.findOne({ mappedUserId: req.user._id }, (error, result)=>{
          if( error ){
            return callback(error);
          }else {
            console.log("Found College for User:", result._id );
            collegeId = result._id;
            callback();
          }
      });
    },
    function(callback){
      console.log("Finding Programs for college", collegeId );
      Program.find({ "college": collegeId })
        .sort('-created')
        .populate('user', 'displayName')
        .exec(function(err, results) {
          if (err) {
            return callback(err);
          } else {
            programs = results;            
            callback();
          }
        });
    }
  ],
  function(error){
      if( error ){
          console.log( error );
          return res.status(400).send({
            message: errorHandler.getErrorMessage(error)
          }); 
      }
      res.jsonp( programs );
  });
  
};

/**
 * Program mapped to user id
 */
exports.getProgramMappedToUser = function(req, res) {

  Program.findOne({ mappedUserId: req.params.mappedUserId })
  .populate('user', 'displayName')
  .exec(function (err, program) {
    if (err) {
      return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
        });
    } else if (!program) {
      return res.status(404).send({
        message: 'No Program with that identifier has been found'
      });
    } else {
      res.jsonp( program );
    }   
  });
};

/**
 * Program middleware
 */
exports.programByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Program is invalid'
    });
  }

  Program.findById(id)
  .populate('user', 'displayName')
  .exec(function (err, program) {
    if (err) {
      return next(err);
    } else if (!program) {
      return res.status(404).send({
        message: 'No Program with that identifier has been found'
      });
    }
    req.program = program;
    next();
  });
};
