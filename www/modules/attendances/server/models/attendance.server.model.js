'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Attendance Schema
 */
var AttendanceSchema = new Schema({

  batch: {
    type: Schema.ObjectId,
    ref :'Batch'  
  },
  lecture: {
    type: Schema.ObjectId,
    ref :'Lecture'
  },
  section: {
    type: String,
    enum :['A','B','C','D','E'],
    default: '',
    required: 'Please fill  section',
    trim: true
  },
   subject: {
    type: Schema.ObjectId,
    ref :'Subject'
  },
  students: [{ 
    student: {
      type: Schema.ObjectId,
      ref: 'Student'
    },
    status: {
      type: String,
      enum :['A','P'],
      default: 'P'
    }
  }],
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

//create By veda
AttendanceSchema.statics.getstudentattendance = function( studentId, cb ){
  //console.log("vvrrrrr"+studentId);
  // return this.find({},cb)
  return this.aggregate([
      {
        $match: {
          "students._id": mongoose.Types.ObjectId(studentId)        
        }
      },
       { "$unwind": "$students"},
       { 
        "$match": {"students._id":mongoose.Types.ObjectId(studentId) }
      },
        {
        $group: {
          _id: {
            subject: "$subject",
            status: "$student.status",				
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
      },
        {
          $group: {	
              _id: {
                  subject: "$_id.subject"
              },
              student: {
                  "$push": {
                    "pCount": "$pCount",
                    "totalAttendance": "$totalAttendance"
                }
              }
          }
      },
    //  {
    //               $group:{
    //                 _id :{
    //                 //  student:'$students._id',
    //                   status:'$students.status',
    //                  subject:'$subject' ,
    //                   batch:'$batch',
    //                   section:'$section'          
    //                 },
    //                pCount: {
    //                   $sum:{
    //                     "$cond": [
    //                       {
    //                       $eq: [ "$students.status", 'P' ]
    //                       },1,0]
    //                   }
    //                },totalAttendance:{$sum:1}
    //               }
    //           },
               
      {
      "$project":{
          _id: 0,
          subject: "$_id.subject",
          student: 1
        }
      }	  
               
              
                
      //      {
      //     $group: {	
      //         _id: {
      //             subject: "$_Id:subject"
      //         }
            
      //     }
      // }
      
    ], cb );
};
mongoose.model('Attendance', AttendanceSchema);


// [{"student":[{"pCount":1,"totalAttendance":3}],"subject":{"_id":"5977
// 310293ecbbcc1b4eacc9","subjectCode":"ANg1","name":"java"}},{"student":[{"pCount"
// :0,"totalAttendance":3}],"subject":{"_id":"597817532729561810b037be","subjectCod
// e":"vb123","name":"vb"}},{"student":[{"pCount":1,"totalAttendance":2}],"subject"
// :{"_id":"597730ef93ecbbcc1b4eacc4","subjectCode":"j123","name":"Angular"}}]