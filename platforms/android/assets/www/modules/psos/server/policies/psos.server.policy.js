'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Psos Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['hod'],
    allows: [{
      resources: '/api/psos',
      permissions: '*'
    }, {
      resources: '/api/psos/:psoId',
      permissions: '*'
    }]
  }, {
    roles: ['hod','lecture','student','admin'],
    allows: [{
      resources: '/api/psos',
      permissions: ['get']
    }, {
      resources: '/api/psos/program/:programId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Psos Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Pso is being processed and the current user created it then allow any manipulation
  if (req.pso && req.user && req.pso.user && req.pso.user.id === req.user.id) {
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
