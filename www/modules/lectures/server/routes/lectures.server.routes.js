'use strict';

/**
 * Module dependencies
 */
var lecturesPolicy = require('../policies/lectures.server.policy'),
  lectures = require('../controllers/lectures.server.controller');

module.exports = function(app) {
  // Lectures Routes
  app.route('/api/lectures').all(lecturesPolicy.isAllowed)
    .get(lectures.list)
    .post(lectures.create);

  app.route('/api/lectures/mappedUserId/:mappedUserId').all(lecturesPolicy.isAllowed)
    .get(lectures.getLectureMappedToUser );

  app.route('/api/lectures/bulk').all(lecturesPolicy.isAllowed) 
     .post(lectures.updateAllLecturers);
     
  app.route('/api/lectures/:lectureId').all(lecturesPolicy.isAllowed)
    .get(lectures.read)
    .put(lectures.update)
    .delete(lectures.delete);
  
  app.route('/api/lecturessubjects/').all( lecturesPolicy.isAllowed)
     .get( lectures.getSubjectsAssignedToLecture );

  // Finish by binding the Lecture middleware
  app.param('lectureId', lectures.lectureByID);
};
