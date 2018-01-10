'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Assessment = mongoose.model('Assessment'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  assessment;

/**
 * Assessment routes tests
 */
describe('Assessment CRUD tests', function () {

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

    // Save a user to the test db and create new Assessment
    user.save(function () {
      assessment = {
        name: 'Assessment name'
      };

      done();
    });
  });

  it('should be able to save a Assessment if logged in', function (done) {
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

        // Save a new Assessment
        agent.post('/api/assessments')
          .send(assessment)
          .expect(200)
          .end(function (assessmentSaveErr, assessmentSaveRes) {
            // Handle Assessment save error
            if (assessmentSaveErr) {
              return done(assessmentSaveErr);
            }

            // Get a list of Assessments
            agent.get('/api/assessments')
              .end(function (assessmentsGetErr, assessmentsGetRes) {
                // Handle Assessments save error
                if (assessmentsGetErr) {
                  return done(assessmentsGetErr);
                }

                // Get Assessments list
                var assessments = assessmentsGetRes.body;

                // Set assertions
                (assessments[0].user._id).should.equal(userId);
                (assessments[0].name).should.match('Assessment name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Assessment if not logged in', function (done) {
    agent.post('/api/assessments')
      .send(assessment)
      .expect(403)
      .end(function (assessmentSaveErr, assessmentSaveRes) {
        // Call the assertion callback
        done(assessmentSaveErr);
      });
  });

  it('should not be able to save an Assessment if no name is provided', function (done) {
    // Invalidate name field
    assessment.name = '';

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

        // Save a new Assessment
        agent.post('/api/assessments')
          .send(assessment)
          .expect(400)
          .end(function (assessmentSaveErr, assessmentSaveRes) {
            // Set message assertion
            (assessmentSaveRes.body.message).should.match('Please fill Assessment name');

            // Handle Assessment save error
            done(assessmentSaveErr);
          });
      });
  });

  it('should be able to update an Assessment if signed in', function (done) {
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

        // Save a new Assessment
        agent.post('/api/assessments')
          .send(assessment)
          .expect(200)
          .end(function (assessmentSaveErr, assessmentSaveRes) {
            // Handle Assessment save error
            if (assessmentSaveErr) {
              return done(assessmentSaveErr);
            }

            // Update Assessment name
            assessment.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Assessment
            agent.put('/api/assessments/' + assessmentSaveRes.body._id)
              .send(assessment)
              .expect(200)
              .end(function (assessmentUpdateErr, assessmentUpdateRes) {
                // Handle Assessment update error
                if (assessmentUpdateErr) {
                  return done(assessmentUpdateErr);
                }

                // Set assertions
                (assessmentUpdateRes.body._id).should.equal(assessmentSaveRes.body._id);
                (assessmentUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Assessments if not signed in', function (done) {
    // Create new Assessment model instance
    var assessmentObj = new Assessment(assessment);

    // Save the assessment
    assessmentObj.save(function () {
      // Request Assessments
      request(app).get('/api/assessments')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Assessment if not signed in', function (done) {
    // Create new Assessment model instance
    var assessmentObj = new Assessment(assessment);

    // Save the Assessment
    assessmentObj.save(function () {
      request(app).get('/api/assessments/' + assessmentObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', assessment.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Assessment with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/assessments/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Assessment is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Assessment which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Assessment
    request(app).get('/api/assessments/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Assessment with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Assessment if signed in', function (done) {
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

        // Save a new Assessment
        agent.post('/api/assessments')
          .send(assessment)
          .expect(200)
          .end(function (assessmentSaveErr, assessmentSaveRes) {
            // Handle Assessment save error
            if (assessmentSaveErr) {
              return done(assessmentSaveErr);
            }

            // Delete an existing Assessment
            agent.delete('/api/assessments/' + assessmentSaveRes.body._id)
              .send(assessment)
              .expect(200)
              .end(function (assessmentDeleteErr, assessmentDeleteRes) {
                // Handle assessment error error
                if (assessmentDeleteErr) {
                  return done(assessmentDeleteErr);
                }

                // Set assertions
                (assessmentDeleteRes.body._id).should.equal(assessmentSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Assessment if not signed in', function (done) {
    // Set Assessment user
    assessment.user = user;

    // Create new Assessment model instance
    var assessmentObj = new Assessment(assessment);

    // Save the Assessment
    assessmentObj.save(function () {
      // Try deleting Assessment
      request(app).delete('/api/assessments/' + assessmentObj._id)
        .expect(403)
        .end(function (assessmentDeleteErr, assessmentDeleteRes) {
          // Set message assertion
          (assessmentDeleteRes.body.message).should.match('User is not authorized');

          // Handle Assessment error error
          done(assessmentDeleteErr);
        });

    });
  });

  it('should be able to get a single Assessment that has an orphaned user reference', function (done) {
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

          // Save a new Assessment
          agent.post('/api/assessments')
            .send(assessment)
            .expect(200)
            .end(function (assessmentSaveErr, assessmentSaveRes) {
              // Handle Assessment save error
              if (assessmentSaveErr) {
                return done(assessmentSaveErr);
              }

              // Set assertions on new Assessment
              (assessmentSaveRes.body.name).should.equal(assessment.name);
              should.exist(assessmentSaveRes.body.user);
              should.equal(assessmentSaveRes.body.user._id, orphanId);

              // force the Assessment to have an orphaned user reference
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

                    // Get the Assessment
                    agent.get('/api/assessments/' + assessmentSaveRes.body._id)
                      .expect(200)
                      .end(function (assessmentInfoErr, assessmentInfoRes) {
                        // Handle Assessment error
                        if (assessmentInfoErr) {
                          return done(assessmentInfoErr);
                        }

                        // Set assertions
                        (assessmentInfoRes.body._id).should.equal(assessmentSaveRes.body._id);
                        (assessmentInfoRes.body.name).should.equal(assessment.name);
                        should.equal(assessmentInfoRes.body.user, undefined);

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
      Assessment.remove().exec(done);
    });
  });
});
