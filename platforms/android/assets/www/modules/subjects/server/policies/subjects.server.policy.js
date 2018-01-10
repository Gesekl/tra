'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Subjects Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['hod','college_admin','lecture','student'],
    allows: [{
      resources: '/api/subjects',
      permissions: '*'
    }, {
      resources: '/api/subjects/bulk',
      permissions: '*'
    },{// created By Veda for fileupload
      resources: '/api/subjects/fileUpload',
      permissions: '*'
    },{// created By Veda for fileDownload
      resources: '/api/subjects/fileDownload/:fileId',
      permissions: '*'
    }, {
      resources: '/api/subjects/:subjectId',
      permissions: '*'
    }, {
      resources: '/api/subjects/:batchId/:section',
      permissions: '*'
    },
    {
      resources: '/api/subjects/specific/:batchId/:section',
      permissions: '*'
    }]
  }]);
};

/**
 * Check If Subjects Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest','lecture'];

  // If an Subject is being processed and the current user created it then allow any manipulation
  if (req.subject && req.user && req.subject.user && req.subject.user.id === req.user.id) {
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
