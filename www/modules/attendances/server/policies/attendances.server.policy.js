'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Attendances Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['lecture','college_admin'],
    allows: [{
      resources: '/api/attendances',
      permissions: '*'
    }, {
      resources: '/api/attendances/:attendanceId',
      permissions: '*'
    }]
  }, {
    roles: ['lecture','college_admin'],
    allows: [{
      resources: '/api/attendances',
      permissions: ['get', 'post']
    }, {
      resources: '/api/attendances/:attendanceId',
      permissions: ['get']
    }
    ]
  },{    // created veda
    roles: ['student','parent','college_admin'],
    allows: [{
      resources: '/api/attendances',
      permissions: ['get']
    },{
      resources: '/api/attendances/studentsummary/:studentId',
      permissions: ['get']
    }
    ]
  },{    // created veda
    roles: ['lecture','college_admin'],
    allows: [{
      resources: '/api/attendances/update/:recordId/:date/:status',
      permissions: ['get']
    }
    ]
  }
  , {
    roles: ['lecture','college_admin'],
    allows: [{
      resources: '/api/attendances',
      permissions: ['get']
    }, {
      resources: '/api/attendances/:attendanceId',
      permissions: ['get']
    }, {
      resources: '/api/attendances/summary/:batchId/:section/:userId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Attendances Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['lecture','student','college_admin'];

  // If an Attendance is being processed and the current user created it then allow any manipulation
  if (req.attendance && req.user && req.attendance.user && req.attendance.user.id === req.user.id) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
