'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Batch = mongoose.model('Batch'),
  Program = mongoose.model('Program'),
  Lecture = mongoose.model('Lecture'),
   Student = mongoose.model('Student'),
  Subject = mongoose.model("Subject"),
  async = require("async"),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

const getProgramForUser = ( userId, callback )=>{
    Program.findOne( { 'mappedUserId': userId}, function(error,result){
      if( error ){
        return callback(error );
      }else {        
        callback( null, result );
      }
    });
};

const getLecutreForUser = ( userId, callback )=>{
    Lecture.findOne( { 'mappedUserId': userId }, function(error,result){
      if( error ){
        return callback(error );
      }else {        
        callback( null, result );
      }
    });
};
//create by veda
const getstudentForUser = ( userId, callback )=>{
    Student.findOne( { 'mappedUserId': userId }, function(error,result){
      if( error ){
        return callback(error );
      }else {        
        callback( null, result );
      }
    });
};

/**
 * Create a Batch
 */
exports.create = function(req, res) {
  var batch = new Batch(req.body);
  batch.user = req.user;
  async.series([
    function(callback){
      getProgramForUser( req.user._id, (error, result)=>{
          if( error ) return callback(error);
          else {
            batch.program = result;
            callback();
          }
      });
    },
    function(callback){
      batch.save((error,result)=>{
        if( error ) return callback(error);
        else {
          callback();
        }
      })
    }
  ],function(error){
    if( error ){
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
    res.jsonp( batch );
  });
};

/**
 * Show the current Batch
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var batch = req.batch ? req.batch.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  batch.isCurrentUserOwner = req.user && batch.user && batch.user._id.toString() === req.user._id.toString();

  res.jsonp(batch);
};

/**
 * Update a Batch
 */
exports.update = function(req, res) {
  var batch = req.batch;

  batch = _.extend(batch, req.body);

  batch.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(batch);
    }
  });
};

/**
 * Delete an Batch
 */
exports.delete = function(req, res) {
  var batch = req.batch;

  batch.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(batch);
    }
  });
};


/**
 * Get aggreated subject details
 */
exports.listOfCOPSOs = (req, res)=>{
  Subject.getAggregatedCOPSOForBatch( { batchId: req.params.batchId, section: req.params.section }, (err, copsos)=>{
      if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            res.jsonp( copsos );
          }    
       }
  );
};

/**
 * Get aggreated subject details
 */
exports.listOfCOPOs = (req, res)=>{
  Subject.getAggregatedCOPOForBatch({ batchId: req.params.batchId, section: req.params.section }, (err, copos)=>{
      if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            res.jsonp( copos );
          }    
      }
  );
};

/**
 * List of Batches
 */
exports.list = function(req, res) { 
  let program, batches;
  async.series([
    (callback)=>{    
      getProgramForUser( req.user._id, (error, result)=>{
          if( error ) return callback(error);
          else {
            program = result;
            callback();
          }
      });    
    },
    (callback)=>{
      if(program){
         Batch.find({ 'program': program._id }).sort('-created')
          .populate('user', 'displayName')  
          .exec(function(err, results) {
          if (err) {
            return callback(err);
          } else {
            batches = results;
            callback();
          }
        });
      }else{
        console.log('no program');
         return res.status(400).send({
            message: 'No program'
          });
      }
       
    }
  ],function(error){
       if( error ){
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        }
        res.jsonp( batches );
  });
  
};

/**
 * List of Batches for lecture
 */
exports.listForLecture = function(req, res) { 

  let lecture, batches;
  console.log( "Lecture User ID", req.user._id );
  async.series([
    (callback)=>{
      getLecutreForUser( req.user._id, ( error, result)=>{
          if( error ) return callback( error );
          lecture = result;
          callback();
      });
    },
    (callback)=>{
        Batch.find({ 'program': lecture.program }).sort('-created')
          .populate('user', 'displayName')  
          .exec(function(err, results) {
          if (err) {
            return callback( err );
          } else {
            batches = results;
            callback();
          }
        })      
    }
  ], (err)=>{
      if( err ){
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });  
      }else {
        res.jsonp( batches );
      }
  });
}
                      
//list student created By veda
exports.listForstudent = function(req, res) { 

  let lecture, batches;
  console.log( "student User ID222", req.user._id );
  async.series([
    (callback)=>{
      getstudentForUser( req.user._id, ( error, result)=>{
          if( error ) return callback( error );
          lecture = result;
          callback();
      });
    },
    (callback)=>{
        Batch.find({ 'program': lecture.program }).sort('-created')
          .populate('user', 'displayName')  
          .exec(function(err, results) {
          if (err) {
            return callback( err );
          } else {
            batches = results;
            callback();
          }
        })      
    }
  ], (err)=>{
      if( err ){
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });  
      }else {
        res.jsonp( batches );
      }
  });
}
/**
 * Batch middleware
 */
exports.batchByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Batch is invalid'
    });
  }
  
  Batch.findById(id)
  .populate('user', 'displayName')
  .exec(function (err, batch) {
    if (err) {
      return next(err);
    } else if (!batch) {
      return res.status(404).send({
        message: 'No Batch with that identifier has been found'
      });
    }
    req.batch = batch;
    next();
  });
};
