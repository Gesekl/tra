'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  defaultPOs = require('../constants/pos.server.constant'),
  Schema = mongoose.Schema;

/**
 * Po Schema
 */
var PoSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill PO name',
    trim: true
  },
  description: {
    type: String,
    default: '',
    required: 'Please fill PO description',
    maxlength: 2000,
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  program: {
    type: Schema.ObjectId,
    ref: 'Program'
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});


PoSchema.statics.addDefaultPOs= function(program){
    
    defaultPOs.forEach( (po)=>{      
        po.program = program;
        po.user = program.user;
        
        let poModel = new this( po );
        
        poModel.save((error)=>{
          if(error){
            console.error("Unable to save Program Outcome", error );
          }
        });
    });
};

mongoose.model('Po', PoSchema);
