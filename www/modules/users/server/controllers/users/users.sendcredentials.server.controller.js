'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
  fs = require('fs'),
  path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  mongoose = require('mongoose'),
  multer = require('multer'),
  nodemailer = require('nodemailer'),
  config = require(path.resolve('./config/config')),
  User = mongoose.model('User');

//nodemailer version ^0.7.1
var smtpTransport = nodemailer.createTransport("SMTP",config.mailer.options);
/**
 * Send Credentials to user MailID
 */
exports.sendmail = function (email,pass) {
 
var mailOptions={
       to : email,
       subject : 'welcome to GES track',
       text :'Login Details for college\nusername:\t'+email+'\nPassword:\t'+pass
   }
   console.log(mailOptions.text);
   smtpTransport.sendMail(mailOptions, function(error, response){
    if(error){
           console.log(error);
       //res.end("error");
       return error;
    }else{
           console.log("Message sent: " + response.message);
        //res.send("sent");
        }
});

        console.log("Mail IS Sending......");
};


exports.randomPassword = function(){
  var chars = "abcdefghijklmnopqrstuvwxyz!@#%ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
   var pass = "iO#6";
   for (var x = 0; x <6; x++) {
       var i = Math.floor(Math.random() * chars.length);
       pass += chars.charAt(i);
   }
   return pass;
}


