'use strict';

/**
 * Module dependencies
 */
var studentsPolicy = require('../policies/students.server.policy'),
  students = require('../controllers/students.server.controller');

module.exports = function(app) {
  // Students Routes
  app.route('/api/students').all(studentsPolicy.isAllowed) 
    .post(students.create);

  app.route('/api/students/mappedUserId/:mappedUserId').all(studentsPolicy.isAllowed)
    .get(students.getStudentMappedToUser );

  app.route('/api/students/bulk').all(studentsPolicy.isAllowed) 
    .post(students.updateAllStudents);

  app.route('/api/students/:batchId/:section').all(studentsPolicy.isAllowed) 
    .get( students.list );
  
   app.route('/api/students/specific/:batchId/:section').all(studentsPolicy.isAllowed) 
    .get( students.getStudents );

  app.route('/api/students/:studentId').all(studentsPolicy.isAllowed)
    .get(students.read)
    .put(students.update)
    .delete(students.delete);

  // Finish by binding the Student middleware
  app.param('studentId', students.studentByID);
};
