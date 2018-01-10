'use strict';

/**
 * Module dependencies
 */
var psosPolicy = require('../policies/psos.server.policy'),
  psos = require('../controllers/psos.server.controller');

module.exports = function(app) {
  // Psos Routes
  app.route('/api/psos').all(psosPolicy.isAllowed)
    .get(psos.list)
    .post(psos.create);

    // Psos Routes
  app.route('/api/psos/program/:programId').all(psosPolicy.isAllowed)
    .get(psos.listAllPSOsForProgram);
    

  app.route('/api/psos/:psoId').all(psosPolicy.isAllowed)
    .get(psos.read)
    .put(psos.update)
    .delete(psos.delete);

  // Finish by binding the Pso middleware
  app.param('psoId', psos.psoByID);
};
