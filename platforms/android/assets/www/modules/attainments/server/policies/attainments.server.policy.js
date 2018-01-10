'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Attainments Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['lecture'],
    allows: [{
      resources: '/api/attainments',
      permissions: '*'
    }, {
      resources: '/api/attainments/lectures',
      permissions: '*'
    }, {
      resources: '/api/attainments/subject/:subjectId',
      permissions: '*'
    }, {
      resources: '/api/attainments/:attainmentId',
      permissions: '*'
    }]
  }, {
    roles: ['hod'],
    allows: [{
      resources: '/api/attainments',
      permissions: "*"
    }, {
      resources: '/api/attainments/subject/:subjectId',
      permissions: ['get']
    },{
      resources: '/api/attainments/batch/:batchId/:section',
      permissions: '*'
    }]
  }]);
};

/**
 * Check If Attainments Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Attainment is being processed and the current user created it then allow any manipulation
  if (req.attainment && req.user && req.attainment.user && req.attainment.user.id === req.user.id) {
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
