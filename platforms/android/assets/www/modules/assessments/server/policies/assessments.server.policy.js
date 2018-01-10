'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Assessments Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['lecture'],
    allows: [{
      resources: '/api/assessments',
      permissions: '*'
    },{
      resources: '/api/assessments/all',
      permissions: '*'
    } , {
      resources: '/api/assessments/:batchId/:section/:subjectId',
      permissions: '*'
    },{       //created by veda for all student assessment
      resources: '/api/assessments/allstudent/:batchId/:section/:subjectId',
      permissions: '*'
    },{
      resources: '/api/assessments/:assessmentId',
      permissions: '*'
    }]
  },{
    roles: ['student','parent'],
    allows: [{
      resources: '/api/assessments',
      permissions: ['get']
    }, {
      resources: '/api/assessments/student/:studentId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Assessments Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  console.log("User:", req.user, req.user.roles );
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Assessment is being processed and the current user created it then allow any manipulation
  if (req.assessment && req.user && req.assessment.user && req.assessment.user.id === req.user.id) {
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
