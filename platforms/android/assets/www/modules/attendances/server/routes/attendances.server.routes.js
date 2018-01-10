'use strict';

/**
 * Module dependencies
 */
var attendancesPolicy = require('../policies/attendances.server.policy'),
  attendances = require('../controllers/attendances.server.controller');

module.exports = function(app) {
  // Attendances Routes
  app.route('/api/attendances').all(attendancesPolicy.isAllowed)
    .get(attendances.list)
    .post(attendances.create);

  app.route('/api/attendances/summary/:batchId/:section/:userId').all(attendancesPolicy.isAllowed)
    .get( attendances.attendanceSummary );
  //for student attendance
  app.route('/api/attendances/studentsummary/:studentId').all(attendancesPolicy.isAllowed)
    .get( attendances.getstudentattendance );

// created By veda for attendance update
 app.route('/api/attendances/update/:recordId/:date/:status').all(attendancesPolicy.isAllowed)
    .get( attendances.updateattend );

  app.route('/api/attendances/:attendanceId').all(attendancesPolicy.isAllowed)
    .get(attendances.read)
    .put(attendances.update)
    .delete(attendances.delete);

  // Finish by binding the Attendance middleware
  app.param('attendanceId', attendances.attendanceByID);
};
