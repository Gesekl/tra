'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  College = mongoose.model('College'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  college;

/**
 * College routes tests
 */
describe('College CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new College
    user.save(function () {
      college = {
        name: 'College name'
      };

      done();
    });
  });

  it('should be able to save a College if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new College
        agent.post('/api/colleges')
          .send(college)
          .expect(200)
          .end(function (collegeSaveErr, collegeSaveRes) {
            // Handle College save error
            if (collegeSaveErr) {
              return done(collegeSaveErr);
            }

            // Get a list of Colleges
            agent.get('/api/colleges')
              .end(function (collegesGetErr, collegesGetRes) {
                // Handle Colleges save error
                if (collegesGetErr) {
                  return done(collegesGetErr);
                }

                // Get Colleges list
                var colleges = collegesGetRes.body;

                // Set assertions
                (colleges[0].user._id).should.equal(userId);
                (colleges[0].name).should.match('College name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an College if not logged in', function (done) {
    agent.post('/api/colleges')
      .send(college)
      .expect(403)
      .end(function (collegeSaveErr, collegeSaveRes) {
        // Call the assertion callback
        done(collegeSaveErr);
      });
  });

  it('should not be able to save an College if no name is provided', function (done) {
    // Invalidate name field
    college.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new College
        agent.post('/api/colleges')
          .send(college)
          .expect(400)
          .end(function (collegeSaveErr, collegeSaveRes) {
            // Set message assertion
            (collegeSaveRes.body.message).should.match('Please fill College name');

            // Handle College save error
            done(collegeSaveErr);
          });
      });
  });

  it('should be able to update an College if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new College
        agent.post('/api/colleges')
          .send(college)
          .expect(200)
          .end(function (collegeSaveErr, collegeSaveRes) {
            // Handle College save error
            if (collegeSaveErr) {
              return done(collegeSaveErr);
            }

            // Update College name
            college.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing College
            agent.put('/api/colleges/' + collegeSaveRes.body._id)
              .send(college)
              .expect(200)
              .end(function (collegeUpdateErr, collegeUpdateRes) {
                // Handle College update error
                if (collegeUpdateErr) {
                  return done(collegeUpdateErr);
                }

                // Set assertions
                (collegeUpdateRes.body._id).should.equal(collegeSaveRes.body._id);
                (collegeUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Colleges if not signed in', function (done) {
    // Create new College model instance
    var collegeObj = new College(college);

    // Save the college
    collegeObj.save(function () {
      // Request Colleges
      request(app).get('/api/colleges')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single College if not signed in', function (done) {
    // Create new College model instance
    var collegeObj = new College(college);

    // Save the College
    collegeObj.save(function () {
      request(app).get('/api/colleges/' + collegeObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', college.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single College with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/colleges/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'College is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single College which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent College
    request(app).get('/api/colleges/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No College with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an College if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new College
        agent.post('/api/colleges')
          .send(college)
          .expect(200)
          .end(function (collegeSaveErr, collegeSaveRes) {
            // Handle College save error
            if (collegeSaveErr) {
              return done(collegeSaveErr);
            }

            // Delete an existing College
            agent.delete('/api/colleges/' + collegeSaveRes.body._id)
              .send(college)
              .expect(200)
              .end(function (collegeDeleteErr, collegeDeleteRes) {
                // Handle college error error
                if (collegeDeleteErr) {
                  return done(collegeDeleteErr);
                }

                // Set assertions
                (collegeDeleteRes.body._id).should.equal(collegeSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an College if not signed in', function (done) {
    // Set College user
    college.user = user;

    // Create new College model instance
    var collegeObj = new College(college);

    // Save the College
    collegeObj.save(function () {
      // Try deleting College
      request(app).delete('/api/colleges/' + collegeObj._id)
        .expect(403)
        .end(function (collegeDeleteErr, collegeDeleteRes) {
          // Set message assertion
          (collegeDeleteRes.body.message).should.match('User is not authorized');

          // Handle College error error
          done(collegeDeleteErr);
        });

    });
  });

  it('should be able to get a single College that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new College
          agent.post('/api/colleges')
            .send(college)
            .expect(200)
            .end(function (collegeSaveErr, collegeSaveRes) {
              // Handle College save error
              if (collegeSaveErr) {
                return done(collegeSaveErr);
              }

              // Set assertions on new College
              (collegeSaveRes.body.name).should.equal(college.name);
              should.exist(collegeSaveRes.body.user);
              should.equal(collegeSaveRes.body.user._id, orphanId);

              // force the College to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the College
                    agent.get('/api/colleges/' + collegeSaveRes.body._id)
                      .expect(200)
                      .end(function (collegeInfoErr, collegeInfoRes) {
                        // Handle College error
                        if (collegeInfoErr) {
                          return done(collegeInfoErr);
                        }

                        // Set assertions
                        (collegeInfoRes.body._id).should.equal(collegeSaveRes.body._id);
                        (collegeInfoRes.body.name).should.equal(college.name);
                        should.equal(collegeInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      College.remove().exec(done);
    });
  });
});
