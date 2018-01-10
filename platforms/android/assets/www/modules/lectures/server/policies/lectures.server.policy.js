'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Lectures Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['hod','college_admin'],
    allows: [{
      resources: '/api/lectures',
      permissions: '*'
    }, {
       resources: '/api/lectures/mappedUserId/:mappedUserId',
       permissions: '*'
     },{
       resources: '/api/lectures/bulk',
       permissions: '*'
     }, {
      resources: '/api/lectures/:lectureId',
      permissions: '*'
    }]
  }, {
    roles: ['lecture'],
    allows: [{
      resources: '/api/lectures',
      permissions: ['get']
    }, {
       resources: '/api/lectures/mappedUserId/:mappedUserId',
       permissions: 'get'
     }, {
      resources: '/api/lectures/:lectureId',
      permissions: ['get']
    }, {
      resources: '/api/lecturessubjects/',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Lectures Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Lecture is being processed and the current user created it then allow any manipulation
  if (req.lecture && req.user && req.lecture.user && req.lecture.user.id === req.user.id) {
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
