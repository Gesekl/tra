'use strict';

/**
 * Module dependencies
 */
var posPolicy = require('../policies/pos.server.policy'),
  pos = require('../controllers/pos.server.controller');

module.exports = function(app) {
  // Pos Routes
  app.route('/api/pos').all(posPolicy.isAllowed)
    .get(pos.list)
    .post(pos.create);

     // Pos Routes
  app.route('/api/pos/program/:programId').all(posPolicy.isAllowed)
    .get(pos.listAllPOsForProgram);
    

  app.route('/api/pos/:poId').all(posPolicy.isAllowed)
    .get(pos.read)
    .put(pos.update)
    .delete(pos.delete);

  // Finish by binding the Po middleware
  app.param('poId', pos.poByID);
};
