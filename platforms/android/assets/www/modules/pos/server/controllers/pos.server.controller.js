'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Po = mongoose.model('Po'),
  Program = mongoose.model("Program"),
  async = require('async'),
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

/**
 * Create a Po
 */
exports.create = function(req, res) {
  var po = new Po(req.body);
  po.user = req.user;
  

  po.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(po);
    }
  });
};

/**
 * Show the current Po
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var po = req.po ? req.po.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  po.isCurrentUserOwner = req.user && po.user && po.user._id.toString() === req.user._id.toString();

  res.jsonp(po);
};

/**
 * Update a Po
 */
exports.update = function(req, res) {
  var po = req.po;

  po = _.extend(po, req.body);
  
    
  po.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(po);
    }
  });
};

/**
 * Delete an Po
 */
exports.delete = function(req, res) {
  var po = req.po;

  po.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(po);
    }
  });
};

/**
 * List of Pos
 */
exports.listAllPOsForProgram = function(req, res) {
  console.log( req.user.roles );
  Po.find({ 'program': req.params.programId })
  .sort('-created')
  .populate('user', 'displayName')
  .exec(function(err, pos) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(pos);
    }
  });
};

/**
 * List of Pos
 */
exports.list = function(req, res) {
   let pos, program;
  async.series([
    (callback)=>{
      getProgramForUser( req.user._id, (error,result)=>{
        if( error ) return callback(error);
        program = result;
        callback();
      })
    },
    (callback)=>{
      Po.find({ 'program': program._id })
        .sort('-created')
        .populate('user', 'displayName')
        .exec(function(err, results ) {
            if( err ) return callback( err );
            pos = results;
            callback();
        });
    }
  ],(err)=>{
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.jsonp(pos);
      }
  })
};

/**
 * Po middleware
 */
exports.poByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Po is invalid'
    });
  }

  Po.findById(id)
  .populate('user', 'displayName')
  .exec(function (err, po) {
    if (err) {
      return next(err);
    } else if (!po) {
      return res.status(404).send({
        message: 'No Po with that identifier has been found'
      });
    }
    req.po = po;
    next(); 
  });
};
