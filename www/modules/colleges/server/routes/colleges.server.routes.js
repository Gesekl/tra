'use strict';

/**
 * Module dependencies
 */
var collegesPolicy = require('../policies/colleges.server.policy'),
  colleges = require('../controllers/colleges.server.controller');

module.exports = function(app) {
  // Colleges Routes
  app.route('/api/colleges').all(collegesPolicy.isAllowed)
    .get(colleges.list)
    .post(colleges.create);

  app.route('/api/colleges/:collegeId').all(collegesPolicy.isAllowed)
    .get(colleges.read)
    .put(colleges.update)
    .delete(colleges.delete);

  // Finish by binding the College middleware
  app.param('collegeId', colleges.collegeByID);
};
