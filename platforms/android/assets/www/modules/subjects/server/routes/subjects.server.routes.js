'use strict';

/**
 * Module dependencies
 */
var subjectsPolicy = require('../policies/subjects.server.policy'),
  subjects = require('../controllers/subjects.server.controller');

module.exports = function(app) {
  // Subjects Routes
  app.route('/api/subjects').all(subjectsPolicy.isAllowed)
    .get(subjects.list)
    .post(subjects.create);

  app.route('/api/subjects/bulk').all(subjectsPolicy.isAllowed) 
    .post(subjects.updateAllSubjects);
    // Created By veda for file Upload
     app.route('/api/subjects/fileUpload').all(subjectsPolicy.isAllowed) 
    .post(subjects.fileUpload);
// created By veda for file download
 app.route('/api/subjects/fileDownload/:fileId').all(subjectsPolicy.isAllowed) 
    .get(subjects.fileDownload);

  app.route('/api/subjects/:subjectId').all(subjectsPolicy.isAllowed)
    .get(subjects.read)
    .put(subjects.update)
    .delete(subjects.delete);

  app.route("/api/subjects/:batchId/:section").all( subjectsPolicy.isAllowed)
     .get( subjects.listSubjectsForBatchAndSection);

  app.route("/api/subjects/specific/:batchId/:section").all( subjectsPolicy.isAllowed)
     .get( subjects.subjectsForBatchAndSection);

  // Finish by binding the Subject middleware
  app.param('subjectId', subjects.subjectByID);
};
