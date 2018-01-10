'use strict';

/**
 * Module dependencies
 */
var assessmentsPolicy = require('../policies/assessments.server.policy'),
  assessments = require('../controllers/assessments.server.controller');

module.exports = function(app) {
  // Assessments Routes
  app.route('/api/assessments').all(assessmentsPolicy.isAllowed)
    .get(assessments.list)
    .post(assessments.create);

  app.route('/api/assessments/all').all(assessmentsPolicy.isAllowed)
     .put( assessments.updateAllAssessments );
 
  app.route('/api/assessments/student/:studentId').all( assessmentsPolicy.isAllowed)
     .get( assessments.getStudentAssessment );
     //for parent access of assessment
     //  app.route('/api/assessments/student/:studentId').all( assessmentsPolicy.isAllowed)
     // .get( assessments.getParentAssessment );

  app.route('/api/assessments/:batchId/:section/:subjectId').all(assessmentsPolicy.isAllowed)
    .get(assessments.getAssessmentsFor); 
    //created by veda all student assessment
    app.route('/api/assessments/allstudent/:batchId/:section/:subjectId').all(assessmentsPolicy.isAllowed)
    .get(assessments.getAssessmentsForStudent);    

  app.route('/api/assessments/:assessmentId').all(assessmentsPolicy.isAllowed)
    .get(assessments.read)
    .put(assessments.update)
    .delete(assessments.delete);

  // Finish by binding the Assessment middleware
  app.param('assessmentId', assessments.assessmentByID);
};
