'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Attainment = mongoose.model('Attainment'),
  Subject = mongoose.model('Subject'),
  Lecture = mongoose.model("Lecture"),
  async = require('async'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Attainment
 */
exports.create = function(req, res) {
  var attainment = new Attainment(req.body);
  attainment.user = req.user;

  attainment.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(attainment);
    }
  });
};

/**
 * Show the current Attainment
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var attainment = req.attainment ? req.attainment.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  attainment.isCurrentUserOwner = req.user && attainment.user && attainment.user._id.toString() === req.user._id.toString();

  res.jsonp(attainment);
};

/**
 * Update a Attainment
 */
exports.update = function(req, res) {
  var attainment = req.attainment;

  attainment = _.extend(attainment, req.body);

  attainment.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(attainment);
    }
  });
};

/**
 * Delete an Attainment
 */
exports.delete = function(req, res) {
  var attainment = req.attainment;

  attainment.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(attainment);
    }
  });
};

/**
 * List of Attainments
 */
exports.list = function(req, res) {
  Attainment.find().sort('-created').populate('user', 'displayName').exec(function(err, attainments) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(attainments);
    }
  });
};

exports.getSubjectAttainment = (req, res )=>{
  Attainment.findOne( { subject: req.params.subjectId }).sort('-created').populate('user', 'displayName').exec(function(err, attainment) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(attainment);
    }
  });
}

/**
 * List of Attainments
 */
exports.listLectureSubjectsAttainment = function(req, res) {
  
  let lecture, subjectIds, attainments;
  async.series([
    (callback)=>{
        Lecture.findOne( { mappedUserId: req.user._id}, (error, result)=>{
          if( error ) return callback( error );
          lecture = result;
          callback();
        })
    },
    (callback)=>{
        Subject.find( { lecture: lecture._id },( error, results )=>{
          if( error ) return callback( error );
          subjectIds = results.map((sub)=>{
            return sub._id;
          });
          callback();          
        })
    },
    (callback)=>{
      Attainment.getAttainmentForSubjects( subjectIds, (err, results )=>{
             if (err) return callback( err );
             attainments  = results;
             callback();
         });
    }
  ], (err)=>{
     if (err) {        
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.jsonp( attainments );
      }
  });   
};

/**
 * List of Attainments for batch & section
 */
exports.listAllAttainmentForBatch = function(req, res) {
   Subject.find( { 'batch': req.params.batchId, 'section': req.params.section })
          .sort('-created')
          .exec((err, subjects)=>{
            if (err) {
              return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
              });
            } else {
              let subjectIds = subjects.map((sub)=>{
                  return sub._id;
              });
              Attainment.getAttainmentForSubjects( subjectIds, (err, attainments)=>{
                  if (err) {
                      return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                      });
                  } else {
                      res.jsonp( attainments );
                  }
              });
            }
        }); 
};

/**
 * Attainment middleware
 */
exports.attainmentByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Attainment is invalid'
    });
  }

  Attainment.findById(id).populate('user', 'displayName').exec(function (err, attainment) {
    if (err) {
      return next(err);
    } else if (!attainment) {
      return res.status(404).send({
        message: 'No Attainment with that identifier has been found'
      });
    }
    req.attainment = attainment;
    next();
  });
};
