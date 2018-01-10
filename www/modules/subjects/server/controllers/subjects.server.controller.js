'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Subject = mongoose.model('Subject'),
  async = require('async'),
  Program = mongoose.model('Program'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');
   
 var Grid = require('gridfs-stream');
  var conn = mongoose.connection;
Grid.mongo = mongoose.mongo;

const getProgramForUser = ( userId, callback )=>{
    Program.findOne( { 'mappedUserId': userId}, function(error,result){
      if( error ){
        return callback(error );
      }else {        
        callback( null, result );
      }
    });
};


let pos = {
  'PO1': "",
  'PO2': "",
  'PO3': "",
  'PO4': "",
  'PO5': "",
  'PO6': "",
  'PO7': "",
  'PO8': "",
  'PO9': "",
  'PO10': "",
  'PO11': "",
  'PO12': "",
};

let psos = {
  'PSO1': "",
  'PSO2': "",
  'PSO3': "",
  'PSO4': "",
  'PSO5': "",
  'PSO6': ""
};
 

let createCOsForSubject = (subject)=>{
    let cos = [];
    [1,2,3,4].forEach((index)=>{
        cos.push({
              name: subject.name + '-' + subject.subjectCode + '-' + index,
              code: subject.subjectCode + "." + index,
              description: "",
              pos: pos,
              psos: psos
        });
    });
    subject.cos = cos;
};
/**
 * Create a Subject
 */
exports.create = function(req, res) {
  var subject = new Subject(req.body);
  subject.user = req.user;
  async.series([
    (callback)=>{
        getProgramForUser( req.user._id, (error, result)=>{
          if( error ) return callback(error);
          subject.program = result;
          callback();
        });
    },
    (callback)=>{
      createCOsForSubject( subject );
      subject.save( (error)=>{
        if( error) return callback(error);
        callback();
      })
    }
  ],(err)=>{
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.jsonp(subject);
      }
  });  
};

/**
 * Show the current Subject
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var subject = req.subject ? req.subject.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  subject.isCurrentUserOwner = req.user && subject.user && subject.user._id.toString() === req.user._id.toString();

  res.jsonp(subject);
};

/**
 * Update a Subject
 */
exports.update = function(req, res) {
  var subject = req.subject;

  subject = _.extend(subject, req.body);
  
  subject.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(subject);
    }
  });
};

/**
 * Delete an Subject
 */
exports.delete = function(req, res) {
  var subject = req.subject;

  subject.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(subject);
    }
  });
};

/**
 * List of Subjects
 */
exports.list = function(req, res) {
  let subjects, program;
  async.series([
    (callback)=>{
      getProgramForUser( req.user._id, (error,result)=>{
        if( error ) return callback(error);
        program = result;
        callback();
      })
    },
    (callback)=>{
      if(program){
        Subject.find({ program: program._id}).sort('-created')
          .populate('user', 'displayName')
          .exec(function(err, results) {
              if( err ) return callback(err);
              subjects = results;
          });
        }else{
          return res.status(400).send({
            message: 'errorHandler.getErrorMessage(err)'
          });
        }
        
    }
  ],(err)=>{
       if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.jsonp(subjects);
        }
  });
 
};

//TODO: use async module to update the response object in each iteration
// and finally send the response object having the information about how many were successful and how many were not

exports.updateAllSubjects = (req,res)=>{
 
  if( req.body ){
    
      let listOfSubjectsHavingIssues = [], program;
      async.series([
        (callback)=>{
            getProgramForUser( req.user._id, (error,result)=>{
                if( error ) return callback(error);
                program = result;
                callback();
            });
        },
        (callback)=>{
            req.body.forEach(( obj )=>{
              console.log(obj);           
                Subject.findOne({ program: program._id, batch: obj.batch, section: obj.section, subjectCode: obj.subjectCode}, ( error, result )=>{
                  if(result){
                    let subject = result;              
                    subject = _.extend(subject, obj);
                    subject.save(function(err) {
                      if (err) {
                        console.error(errorHandler.getErrorMessage(err));
                        listOfSubjectsHavingIssues.push( subject );
                      }
                    });
                  }
                  else{
                    let subject = new Subject(obj);
                    subject.user = req.user;      
                    subject.program = program;      
                    createCOsForSubject(subject);              
                    subject.save(function(err) {
                      if (err) {
                        console.error(errorHandler.getErrorMessage(err));
                        listOfSubjectsHavingIssues.push(subject);
                      }
                    });
                  }
                });                   
            });
            callback();
        }
      ],(error)=>{
          res.jsonp(listOfSubjectsHavingIssues);
      });    
  }
};

/**
 * List of Subjects
 */
exports.listSubjectsForBatchAndSection = function(req, res) {

  let program, subjects;
  async.series([
    (callback)=>{
      getProgramForUser( req.user._id, (error, result)=>{
        if( error ) return callback(error);
        program = result;
        callback();
      })
    },
    (callback)=>{
        Subject.find({ program: program._id, batch: req.params.batchId, section: req.params.section }).sort('subjectCode')
          .populate('user', 'displayName')
          .exec(function(err, results) {
              if( err ) return callback(err);
              subjects = results;
              callback();
          });
    }
  ],(err)=>{
      if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.jsonp(subjects);
        }
  });
 
};

/**
 * Subject middleware
 */
exports.subjectByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Subject is invalid'
    });
  }

  Subject.findById(id)
  .populate('user', 'displayName') 
  .exec(function (err, subject) {
    if (err) {
      return next(err);
    } else if (!subject) {
      return res.status(404).send({
        message: 'No Subject with that identifier has been found'
      });
    }
    req.subject = subject;
    next();
  });
};


exports.subjectsForBatchAndSection = function(req, res) {
  Subject.find({ batch: req.params.batchId, section: req.params.section }).sort('-created')
  .populate('user', 'displayName')
  .exec(function(err, subjects) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(subjects);
    }
  });
};
// created By veda for file upload
exports.fileUpload = function(req, res) {
 var gfs = Grid(conn.db);
var fs = require('fs');

	var part = req.files.file;
  	        var writeStream = gfs.createWriteStream({
                    filename:part.name,
    			         	mode: 'w',
                    content_type:part.mimetype,
                });
                
    	 writeStream.on('close', function(data) {
         console.log("the data is"+JSON.stringify( data));
                     return res.status(200).send(data);
                });
           writeStream.write(part.data);
              writeStream.end(part.data);
};
// created By veda for file download
exports.fileDownload = function(req, res) {
 console.log('fileDownload.....'+req.params.fileId);
  var gfs = Grid(conn.db);
 gfs.findOne({
        _id: req.params.fileId
    }, function(err, file) {
        if (err) {
         
            return res.status(400).send(err);
        } else if (!file) {
        
            return res.status(404).send('Error on the database looking for the file.');
        }
              
         res.set('File-Name', file.filename);
         res.set('FileType', file.filename.split('.')[1]);
        res.set('Content-Type', file.contentType);
        res.set('Content-Disposition', 'attachment; filename="' + file.filename + '"');
        var readstream = gfs.createReadStream({
            _id: req.params.fileId
            
        });
       
      readstream.on('error', function (err) {
      res.end(); 
    });
     readstream.pipe(res);
   
     
    });
};

// created By veda Get AI QP file Details
exports.qpForlecture = function(req, res) {
 console.log('file QP displaying...');
};