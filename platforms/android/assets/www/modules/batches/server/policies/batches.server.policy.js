'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Batches Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['hod','college_admin'],
    allows: [{
      resources: '/api/batches',
      permissions: '*'
    },  {
      resources: '/api/batches/copo/:batchId/:section',
      permissions: '*'
    }, {
      resources: '/api/batches/copso/:batchId/:section',
      permissions: '*'
    },{
      resources: '/api/batches/:batchId',
      permissions: '*'
    }]
  }, {
    roles: ['lecture','admin'],
    allows: [{
      resources: '/api/batches',
      permissions: ['get']
    },{
      resources: '/api/batches/lectures',
      permissions: ['get']
    }, {
      resources: '/api/batches/:batchId',
      permissions: ['get']
    }]
  }, {       //created by veda for student attedance
    roles: ['student','admin'],
    allows: [{
      resources: '/api/batches',
      permissions: ['get']
    },{
      resources: '/api/batches/students',
      permissions: ['get']
    }, {
      resources: '/api/batches/:batchId',
      permissions: ['get']
    }]
  }
  ]);
};

/**
 * Check If Batches Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Batch is being processed and the current user created it then allow any manipulation
  if (req.batch && req.user && req.batch.user && req.batch.user.id === req.user.id) {
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
