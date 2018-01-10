'use strict';

/**
 * Module dependencies
 */
var attainmentsPolicy = require('../policies/attainments.server.policy'),
  attainments = require('../controllers/attainments.server.controller');

module.exports = function(app) {
  // Attainments Routes
  app.route('/api/attainments').all(attainmentsPolicy.isAllowed)
    .get(attainments.list)
    .post(attainments.create);

  app.route('/api/attainments/batch/:batchId/:section').all(attainmentsPolicy.isAllowed)
    .get(attainments.listAllAttainmentForBatch);

  app.route('/api/attainments/subject/:subjectId').all(attainmentsPolicy.isAllowed)
    .get(attainments.getSubjectAttainment );
    
  app.route('/api/attainments/lectures').all(attainmentsPolicy.isAllowed)
    .get(attainments.listLectureSubjectsAttainment);

  app.route('/api/attainments/:attainmentId').all(attainmentsPolicy.isAllowed)
    .get(attainments.read)
    .put(attainments.update)
    .delete(attainments.delete);

  // Finish by binding the Attainment middleware
  app.param('attainmentId', attainments.attainmentByID);
};
