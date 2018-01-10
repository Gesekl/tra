'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  defaultPSOs = require('../constants/psos.server.constant');
  

/**
 * Pso Schema
 */
var PsoSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Pso name',
    trim: true
  },
   description: {
    type: String,
    default: '',
    required: 'Please fill PSO description',
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

PsoSchema.statics.addDefaultPSOs = function( program ){
    
    defaultPSOs.forEach( (pso)=>{
        pso.program = program;
        pso.user = program.user;
        
        let psoModel = new this( pso );
        psoModel.save((error)=>{
          if( error ){
            console.error("Unable to save Program Specific Outcome", error );
          }
        });
    });
};

mongoose.model('Pso', PsoSchema);
