'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Subject = mongoose.model('Subject'),
  Attendance = mongoose.model('Attendance'),
  Student = mongoose.model('Student'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');



/**
 * Create a Attendance
 */
exports.create = function(req, res) {
  var attendance = new Attendance(req.body);
  attendance.user = req.user;

  attendance.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(attendance);
    }
  });
};

/**
 * Show the current Attendance
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var attendance = req.attendance ? req.attendance.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  attendance.isCurrentUserOwner = req.user && attendance.user && attendance.user._id.toString() === req.user._id.toString();

  res.jsonp(attendance);
};

/**
 * Update a Attendance
 */
exports.update = function(req, res) {
  var attendance = req.attendance;

  attendance = _.extend(attendance, req.body);

  attendance.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(attendance);
    }
  });
};

/**
 * Delete an Attendance
 */
exports.delete = function(req, res) {
  var attendance = req.attendance;

  attendance.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(attendance);
    }
  });
};

/**
 * List of Attendances
 */
exports.list = function(req, res) {
  Attendance.find().sort('-created').populate('user', 'displayName').exec(function(err, attendances) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(attendances);
    }
  });
};

/**
 * Attendance middleware
 */
exports.attendanceByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Attendance is invalid'
    });
  }

  Attendance.findById(id).populate('user', 'displayName').exec(function (err, attendance) {
    if (err) {
      return next(err);
    } else if (!attendance) {
      return res.status(404).send({
        message: 'No Attendance with that identifier has been found'
      });
    }
    req.attendance = attendance;
    next();
  });
};
//create by veda for get attendance for student
exports.getstudentattendance=function(req,res){
  //  var allStdAttendenceResults =['s','d'];
 // from model to get attendance
  
 Attendance.getstudentattendance(req.params.studentId , ( err, results )=>{
        if( err ){
          return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
          }); 
        }else {
          console.log("mmmmmmmmmmm"+JSON.stringify(results));
           Attendance.populate( results, { path: "subject", select:'name subjectCode' }, (err, result)=>{
              if( err ){
                 return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                }); 
              }else {
             
              var attend = [];
                
                result.forEach(function(obj){
                  console.log("obj"+obj);
                  var attendance = {};
                 
                  attendance.pCount =obj.student[0].pCount;
                  attendance.totalAttendance = obj.student[0].totalAttendance;
                  attendance.subjectCode = obj.subject.subjectCode;
                  attendance.name = obj.subject.name;
                  attendance.percent = (obj.student[0].pCount/obj.student[0].totalAttendance)*100;
                  attend.push(attendance);
                    console.log("ccccc"+JSON.stringify(attend));
                })
                  console.log("xxx"+attend);   
                 res.jsonp( attend );
              }
          });   
         
                      
        }

    });
  


}

//created By veda for attendance update

exports.updateattend=function(req,res){

console.log('studentID:'+req.params.recordId);
console.log('date:'+req.params.date);
console.log('Status:'+req.params.status);
if(req.params.status=='A'||req.params.status=='P'){
Attendance.update({ "created" :req.params.date,"students._id" :{$eq:req.params.recordId}},{'$set' :{"students.$.status": req.params.status}}).exec(function(err, attendances) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      var message=[{status:'updated',message:'success'}]
     // console.log('returned update'+JSON.stringify(attendances) );
      res.jsonp(message);
    }
  });
}
else
{
  Attendance.find({ "created" :req.params.date}).sort('-created').populate('user', 'displayName').exec(function(err, attendances) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      var student=[];
      attendances.forEach(function(stu){
        stu.students.forEach(function(s){
          if(s._id==req.params.recordId){
            student.push(s);
          }
        })
      })
      res.jsonp(student);
    }
  });
}



  
}
// end fo update

// Created By veda for get attendance for update
// exports.updateattend=function(req,res){


//   Attendance.find({ "created" :req.params.date}).sort('-created').populate('user', 'displayName').exec(function(err, attendances) {
//     if (err) {
//       return res.status(400).send({
//         message: errorHandler.getErrorMessage(err)
//       });
//     } else {
//       var student=[];
//       console.log('returned data'+attendances);
//       attendances.forEach(function(stu){
//         console.log('stu'+stu.students[0]);
//         stu.students.forEach(function(s){
//           if(s._id==req.params.recordId){
//             console.log('student found');
//             student.push(s);
//           }
//         })
//         console.log('final'+student);
//       })
//       res.jsonp(student);
//     }
//   });
// }
// end fo update
//end of get update
/**
 * Attendance Summary
*/
exports.attendanceSummary = function(req, res) {
  Attendance.aggregate([
              {
                $match:{
                  batch : mongoose.Types.ObjectId(req.params.batchId),
                  section : req.params.section,
                  user : mongoose.Types.ObjectId(req.params.userId)
                }
              },
              {$unwind:"$students"},
              {
                  $group:{
                    _id :{
                      student:'$students._id',
                      subject:"$subject"                                    
                    },
                   pCount: {
                      $sum:{
                        "$cond": [
                          {
                          $eq: [ "$students.status", 'P' ]
                          },1,0]
                      }
                   },totalAttendance:{$sum:1}
                  }
              }
  ]).exec(

      function(err,results){
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            console.log('qqqqqqq'+JSON.stringify(results));
              let allStdAttendenceResults = {};
            
              results.forEach((stdAtt)=>{
                console.log('stdatt'+JSON.stringify(stdAtt));
                if( !allStdAttendenceResults[stdAtt._id.student]){
                      allStdAttendenceResults[stdAtt._id.student] = {};
                }
                allStdAttendenceResults[stdAtt._id.student][stdAtt._id.subject] = stdAtt;
                              
              });
                
              return res.jsonp( allStdAttendenceResults );
          }


 });

};