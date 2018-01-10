'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Lecture = mongoose.model('Lecture'),
  User = mongoose.model('User'),
  Subject = mongoose.model("Subject"),
  Program = mongoose.model("Program"),
  async = require('async'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
    credential=require(path.resolve('./modules/users/server/controllers/users/users.sendcredentials.server.controller')),
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
 * Create a Lecture
 */
exports.create = function(req, res) {
   var pass=credential.randomPassword();
  var lecture = new Lecture(req.body);
  lecture.user = req.user;
  
  let user = new User( User.getUserObject( {
      firstName: lecture.firstName,
      lastName: lecture.lastName,
      email: lecture.email,
      password:pass,
      user: req.user,
      roles: ['lecture']
  }));

  async.series([
    (callback)=>{
      getProgramForUser( req.user._id, (error, result)=>{
        if( error ) return callback(error);
        else {
          lecture.program = result;
          callback();
        }
      });
    },
    (callback)=>{
      user.save((error)=>{
        if( error ) return callback(error);
        else {
          lecture.mappedUserId = user._id;
          callback();
        }
      })
    },
    (callback)=>{
      lecture.save((error)=>{
        if(error) {
          user.remove();// on lecture creation
          return callback(error);
        }
        else callback();
      });
    }
  ],function(error){
    if(error){
        return res.status(400).send({
           message: errorHandler.getErrorMessage(error)
        });
    }
    res.jsonp( lecture );
     credential.sendmail(res,pass);
  }); 
};

let findUser = (username, cb )=>{
    User.findOne({ username: username }, cb );
};

let findLecture = ( email, cb )=>{
    Lecture.findOne({ email: email }, cb );
};

 //TODO: use async module to update the response object in each iteration
  // and finally send the response object having the information about how many were successful and how many were not

exports.updateAllLecturers = (req,res)=>{
  	if (req.body) {
      let lectureUnableToUpdateList = []; 
      async.forEach( req.body , ( lecture, next )=>{       
          lecture.name = lecture.lastName + ", "  + lecture.firstName;
          lecture.user = req.user;
          let user = new User( User.getUserObject( {
              firstName: lecture.firstName,
              lastName: lecture.lastName,
              email: lecture.email,
              user: req.user,
              roles: ['lecture']
          }));
          async.series([
            (callback)=>{ // create user first                
                user.save((error, result)=>{
                  if(error) {
                    return callback(error);
                  }
                  else {
                    lecture.mappedUserId = result._id;
                    callback();
                  }
                });
            },
            (callback)=>{
                getProgramForUser( req.user._id, (error, result)=>{
                  if( error ) return callback(error);
                  else {
                    lecture.program = result;
                    callback();
                  }
                });
            },
            (callback)=>{
              new Lecture( lecture ).save((error)=>{
                  if(error) {
                    user.remove();// on lecture creation
                    return callback(error);
                  }else {
                    callback();
                  }
              });
            }
          ],(error)=>{
              if( error ){ 
                lectureUnableToUpdateList.push( { email: lecture.email,  msg: errorHandler.getErrorMessage(error) } );
              }
              next();
          });
      },
      (error)=>{
        res.jsonp( lectureUnableToUpdateList );
      });        
    }          
};

/**
 * Show the current Lecture
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var lecture = req.lecture ? req.lecture.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  lecture.isCurrentUserOwner = req.user && lecture.user && lecture.user._id.toString() === req.user._id.toString();

  res.jsonp(lecture);
};

/**
 * Update a Lecture
 */
exports.update = function(req, res) {
  var lecture = req.lecture;

  lecture = _.extend(lecture, req.body);

  lecture.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(lecture);
    }
  });
};

/**
 * Delete an Lecture
 */
exports.delete = function(req, res) {
  var lecture = req.lecture;

  lecture.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(lecture);
    }
  });
};

/**
 * List of Lectures
 */
exports.list = function(req, res) {
  let lectures, program;
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
         Lecture.find({'program': program._id})
      .sort('-created')
      .populate('user', 'displayName')
      .exec(function(err, results) {
        if (err) {
          return callback(err);
        } else {
          lectures = results;
          callback();
        }
      });
    }else{
      console.log('no program');
       return res.status(400).send({
            message:' errorHandler.getErrorMessage(err)'
        });
    }
     
    }
  ],(error)=>{
    if( error ){
      return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
        });
    }
    res.jsonp( lectures );
  });

};

/**
 * Get all subjects assigned to lecture
 */
exports.getSubjectsAssignedToLecture = function(req, res) {
  let lecture, subjects;
  async.series([
    (callback)=>{
        Lecture.findOne( { mappedUserId: req.user._id }, (error, result)=>{
          if( error ) return callback(error);
          lecture = result;
          callback();
        })
    },
    (callback)=>{
      Subject.getAllLectureSubjects( { 'lecture': lecture._id }, (err, results )=>{
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
        res.jsonp( subjects );
      }
  });   
};

/**
 * Lecture middleware
 */
exports.getLectureMappedToUser = function(req, res) {

  Lecture.findOne({ mappedUserId: req.params.mappedUserId })
  .populate('user', 'displayName')
  .exec(function (err, lecture) {
    if (err) {
      return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
        });
    } else if (!lecture) {
      return res.status(404).send({
        message: 'No Lecture with that identifier has been found'
      });
    } else {
      res.jsonp( lecture );
    }   
  });
};

/**
 * Lecture middleware
 */
exports.lectureByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Lecture is invalid'
    });
  }

  Lecture.findById(id)
  .populate('user', 'displayName')
  .exec(function (err, lecture) {
    if (err) {
      return next(err);
    } else if (!lecture) {
      return res.status(404).send({
        message: 'No Lecture with that identifier has been found'
      });
    }
    req.lecture = lecture;
    next();
  });
};
