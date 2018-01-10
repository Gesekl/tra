'use strict';

/**
 * Module dependencies
 */
var batchesPolicy = require('../policies/batches.server.policy'),
  batches = require('../controllers/batches.server.controller');

module.exports = function(app) {
  // Batches Routes
  app.route('/api/batches').all(batchesPolicy.isAllowed)
    .get(batches.list)
    .post(batches.create);

  // Batches Routes
  app.route('/api/batches/lectures').all(batchesPolicy.isAllowed)
    .get(batches.listForLecture);
//batches for student created by veda
 app.route('/api/batches/students').all(batchesPolicy.isAllowed)
    .get(batches.listForstudent);
//end
  app.route('/api/batches/copo/:batchId/:section').all(batchesPolicy.isAllowed)
    .get(batches.listOfCOPOs);
  
  app.route('/api/batches/copso/:batchId/:section').all(batchesPolicy.isAllowed)
    .get(batches.listOfCOPSOs);
   

  app.route('/api/batches/:batchId').all(batchesPolicy.isAllowed)
    .get(batches.read)
    .put(batches.update)
    .delete(batches.delete);

  // Finish by binding the Batch middleware
  app.param('batchId', batches.batchByID);
};
