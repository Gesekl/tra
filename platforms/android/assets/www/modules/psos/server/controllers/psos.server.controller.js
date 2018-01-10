'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Pso = mongoose.model('Pso'),
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
 * Create a Pso
 */
exports.create = function(req, res) {
  var pso = new Pso(req.body);
  pso.user = req.user;
  let program;
  async.series([
    (callback)=>{
      getProgramForUser( req.user._id, (error, result)=>{
        if( error ) return callback( error );
        pso.program = result;
        callback();
      })
    },
    (callback)=>{
        pso.save(function(err) {
          if( err )return callback( err );
          callback();
        });
    }
  ], (err)=>{
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.jsonp(pso);
      }
  })
   
};

/**
 * Show the current Pso
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var pso = req.pso ? req.pso.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  pso.isCurrentUserOwner = req.user && pso.user && pso.user._id.toString() === req.user._id.toString();

  res.jsonp(pso);
};

/**
 * Update a Pso
 */
exports.update = function(req, res) {
  var pso = req.pso;

  pso = _.extend(pso, req.body);

  pso.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(pso);
    }
  });
};

/**
 * Delete an Pso
 */
exports.delete = function(req, res) {
  var pso = req.pso;

  pso.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(pso);
    }
  });
};


/**
 * List of Psos
 */
exports.listAllPSOsForProgram = function(req, res) {
  Pso.find({ 'program': req.params.programId })
  .sort('-created')
  .populate('user', 'displayName')
  .exec(function(err, psos) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(psos);
    }
  });
};
/**
 * List of Psos
 */
exports.list = function(req, res) {
  let program, psos;
  async.series([
    (callback)=>{
      getProgramForUser( req.user._id, (error, result)=>{
        if( error ) return callback(error);
        program = result;
        callback();
      })
    },
    (callback)=>{
      Pso.find({ 'program': program._id })
        .sort('-created')
        .populate('user', 'displayName')
        .exec(function(err, results) {
            if ( err ) return callback( err );
            psos = results;
            callback();
        });
    }
  ],(err)=>{
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            res.jsonp(psos);
          }
  })
 
};

/**
 * Pso middleware
 */
exports.psoByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Pso is invalid'
    });
  }

  Pso.findById(id)
  .populate('user', 'displayName')
  .exec(function (err, pso) {
    if (err) {
      return next(err);
    } else if (!pso) {
      return res.status(404).send({
        message: 'No Pso with that identifier has been found'
      });
    }
    req.pso = pso;
    next();
  });
};