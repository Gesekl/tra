'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Student = mongoose.model('Student'),
  User = mongoose.model('User'),
  Program = mongoose.model('Program'),
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
 * Create a Student
 */
exports.create = function(req, res) {
  var passForStudent=credential.randomPassword();
  var student = new Student(req.body);
  student.name = `${student.lastName}, ${student.firstName}`;
  student.user = req.user;
  console.log('user details:'+req.user);
  let user = new User( User.getUserObject( {
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      password:passForStudent,
      user: req.user,
      roles: ['student']
  }));
  // create user object for parent login
  var passForparent=credential.randomPassword();
  let userForparent = new User( User.getUserObject( {
      firstName: student.parentName,
      lastName: '-',
      email: student.parentEmail,
      password:passForparent,
      user: req.user,
      roles: ['parent']
  }));
  async.series([
    (callback)=>{
      getProgramForUser( req.user._id, (error, result)=>{
          if( error ) return callback( error );
          student.program = result;
          callback();
      });
    },
    (callback)=>{
        user.save((error, result)=>{
          if( error )return callback(error);
          student.mappedUserId = result._id;
          callback();
        })
    },
    (callback)=>{
        userForparent.save((error, result)=>{
          if( error ){
             user.remove();
            return callback(error);
          }
         student.mappedUserIdForParent = result._id;
         credential.sendmail(student.email,passForparent);
          callback();
        })
    },
    (callback)=>{
      student.save( (error)=>{
        if( error ){
          user.remove();
          userForparent.remove();
          return callback(error);
        }
        callback();
      })
    }
  ],(error)=>{  
      if(error){
          return res.status(400).send({
                  message: errorHandler.getErrorMessage(error)
                });
      }
      res.jsonp( student );
       credential.sendmail(student.email,passForStudent);
  });

};

let findUser = (username, cb )=>{
    User.findOne({ username: username }, cb );
};


exports.updateAllStudents = (req,res)=>{
 
 if( req.body ){
   let studentsListWithIssues = [];
   async.forEach( req.body, ( student, next)=>{
          var pass=credential.randomPassword();
        student.user = req.user;
        student.name = student.lastName + ", " + student.firstName;
        
        let program;
        let user = new User( User.getUserObject( {
            firstName: student.firstName,
            lastName: student.lastName,
            email: student.email,
               password:pass,
            user: req.user,
            roles: ['student']
        }));

        async.series([
          (callback)=>{
              user.save((error, result)=>{
                  if( error ) {                    
                    return callback(error);
                  }else {
                    student.mappedUserId = result._id;
                    callback();
                  }
              });
          },
          (callback)=>{
               getProgramForUser( req.user._id, (error, result)=>{
                  console.log( "Step 2");                 
                  if( error ) {
                     return callback( error );
                  }else {
                    student.program = result;
                    callback();
                  }
              });
          },
          (callback)=>{
            console.log( "Step 3");
            
            new Student( student ).save( (error)=>{
              if( error ){
                console.log("Error", error );
                user.remove();
                return callback(error);
              }else {
                callback();
                  credential.sendmail(student.email,pass);
              }
            })
          }
        ],(error)=>{
            if( error ){                
                studentsListWithIssues.push( { email: student.email,  msg: errorHandler.getErrorMessage(error) } );
            }
            next();
        });
   }, (error)=>{
      res.jsonp( studentsListWithIssues );
   });
 }   
};

/**
 * Show the current Student
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var student = req.student ? req.student.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  student.isCurrentUserOwner = req.user && student.user && student.user._id.toString() === req.user._id.toString();

  res.jsonp(student);
};

/**
 * Update a Student
 */
exports.update = function(req, res) {
  var student = req.student;

  student = _.extend(student, req.body);

  student.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(student);
    }
  });
};

/**
 * Delete an Student
 */
exports.delete = function(req, res) {
  var student = req.student;

  student.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(student);
    }
  });
};

/**
 * List of Students
 */
exports.list = function(req, res) {
  let program,students;
  async.series([
    (callback)=>{
      getProgramForUser( req.user._id, (error, result)=>{
        if( error ) return callback(error);
        program = result;
        callback();
      })
    },
    (callback)=>{
        Student.find({'program': program._id, 'batch': req.params.batchId, 'section': req.params.section }).sort('usn')
        .populate("batch")
        .populate('user', 'displayName')
        .exec(function(err, results) {
            if( err ) callback( err );
            students = results;
            callback();
        });
    }
  ],(err)=>{
      if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.jsonp(students);
        }
  });

};

/**
 * Student middleware
 */
exports.studentByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Student is invalid'
    });
  }


  Student.findById(id)
  .populate('user', 'displayName')
  .exec(function (err, student) {
    if (err) {
      return next(err);
    } else if (!student) {
      return res.status(404).send({
        message: 'No Student with that identifier has been found'
      });
    }
    req.student = student;
    next();
  });
};

/**
 * Get All Students by Batch and Section
 */
exports.getStudents = function (req, res) {
 
   Student.find({
      "batch": req.params.batchId ,
      "section": req.params.section
  }).sort('usn').exec(function(err, students) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(students);
    }
  });
};

/**
 * Get student mapped to user
 */
/**
 * Program mapped to user id
 */
exports.getStudentMappedToUser = function(req, res) {
  console.log('mapped for veda:'+req.params.mappedUserId);{ mappedUserIdForParent: req.params.mappedUserId }

  let query = Student.findOne({ $or: [ { mappedUserIdForParent: req.params.mappedUserId }, { mappedUserId: req.params.mappedUserId } ] });

  query.then( (result)=>{
      if( !result ){
        res.status(404).send({
            message: 'No Student with that identifier has been found'
        });
      }else {
        res.jsonp( result );
      }
  }).catch((err)=>{
      res.status(400).send({
          message: errorHandler.getErrorMessage(err)
      });
  }) 
};
