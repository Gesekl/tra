'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Attainment = mongoose.model('Attainment'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  attainment;

/**
 * Attainment routes tests
 */
describe('Attainment CRUD tests', function () {

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

    // Save a user to the test db and create new Attainment
    user.save(function () {
      attainment = {
        name: 'Attainment name'
      };

      done();
    });
  });

  it('should be able to save a Attainment if logged in', function (done) {
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

        // Save a new Attainment
        agent.post('/api/attainments')
          .send(attainment)
          .expect(200)
          .end(function (attainmentSaveErr, attainmentSaveRes) {
            // Handle Attainment save error
            if (attainmentSaveErr) {
              return done(attainmentSaveErr);
            }

            // Get a list of Attainments
            agent.get('/api/attainments')
              .end(function (attainmentsGetErr, attainmentsGetRes) {
                // Handle Attainments save error
                if (attainmentsGetErr) {
                  return done(attainmentsGetErr);
                }

                // Get Attainments list
                var attainments = attainmentsGetRes.body;

                // Set assertions
                (attainments[0].user._id).should.equal(userId);
                (attainments[0].name).should.match('Attainment name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Attainment if not logged in', function (done) {
    agent.post('/api/attainments')
      .send(attainment)
      .expect(403)
      .end(function (attainmentSaveErr, attainmentSaveRes) {
        // Call the assertion callback
        done(attainmentSaveErr);
      });
  });

  it('should not be able to save an Attainment if no name is provided', function (done) {
    // Invalidate name field
    attainment.name = '';

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

        // Save a new Attainment
        agent.post('/api/attainments')
          .send(attainment)
          .expect(400)
          .end(function (attainmentSaveErr, attainmentSaveRes) {
            // Set message assertion
            (attainmentSaveRes.body.message).should.match('Please fill Attainment name');

            // Handle Attainment save error
            done(attainmentSaveErr);
          });
      });
  });

  it('should be able to update an Attainment if signed in', function (done) {
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

        // Save a new Attainment
        agent.post('/api/attainments')
          .send(attainment)
          .expect(200)
          .end(function (attainmentSaveErr, attainmentSaveRes) {
            // Handle Attainment save error
            if (attainmentSaveErr) {
              return done(attainmentSaveErr);
            }

            // Update Attainment name
            attainment.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Attainment
            agent.put('/api/attainments/' + attainmentSaveRes.body._id)
              .send(attainment)
              .expect(200)
              .end(function (attainmentUpdateErr, attainmentUpdateRes) {
                // Handle Attainment update error
                if (attainmentUpdateErr) {
                  return done(attainmentUpdateErr);
                }

                // Set assertions
                (attainmentUpdateRes.body._id).should.equal(attainmentSaveRes.body._id);
                (attainmentUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Attainments if not signed in', function (done) {
    // Create new Attainment model instance
    var attainmentObj = new Attainment(attainment);

    // Save the attainment
    attainmentObj.save(function () {
      // Request Attainments
      request(app).get('/api/attainments')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Attainment if not signed in', function (done) {
    // Create new Attainment model instance
    var attainmentObj = new Attainment(attainment);

    // Save the Attainment
    attainmentObj.save(function () {
      request(app).get('/api/attainments/' + attainmentObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', attainment.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Attainment with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/attainments/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Attainment is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Attainment which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Attainment
    request(app).get('/api/attainments/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Attainment with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Attainment if signed in', function (done) {
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

        // Save a new Attainment
        agent.post('/api/attainments')
          .send(attainment)
          .expect(200)
          .end(function (attainmentSaveErr, attainmentSaveRes) {
            // Handle Attainment save error
            if (attainmentSaveErr) {
              return done(attainmentSaveErr);
            }

            // Delete an existing Attainment
            agent.delete('/api/attainments/' + attainmentSaveRes.body._id)
              .send(attainment)
              .expect(200)
              .end(function (attainmentDeleteErr, attainmentDeleteRes) {
                // Handle attainment error error
                if (attainmentDeleteErr) {
                  return done(attainmentDeleteErr);
                }

                // Set assertions
                (attainmentDeleteRes.body._id).should.equal(attainmentSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Attainment if not signed in', function (done) {
    // Set Attainment user
    attainment.user = user;

    // Create new Attainment model instance
    var attainmentObj = new Attainment(attainment);

    // Save the Attainment
    attainmentObj.save(function () {
      // Try deleting Attainment
      request(app).delete('/api/attainments/' + attainmentObj._id)
        .expect(403)
        .end(function (attainmentDeleteErr, attainmentDeleteRes) {
          // Set message assertion
          (attainmentDeleteRes.body.message).should.match('User is not authorized');

          // Handle Attainment error error
          done(attainmentDeleteErr);
        });

    });
  });

  it('should be able to get a single Attainment that has an orphaned user reference', function (done) {
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

          // Save a new Attainment
          agent.post('/api/attainments')
            .send(attainment)
            .expect(200)
            .end(function (attainmentSaveErr, attainmentSaveRes) {
              // Handle Attainment save error
              if (attainmentSaveErr) {
                return done(attainmentSaveErr);
              }

              // Set assertions on new Attainment
              (attainmentSaveRes.body.name).should.equal(attainment.name);
              should.exist(attainmentSaveRes.body.user);
              should.equal(attainmentSaveRes.body.user._id, orphanId);

              // force the Attainment to have an orphaned user reference
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

                    // Get the Attainment
                    agent.get('/api/attainments/' + attainmentSaveRes.body._id)
                      .expect(200)
                      .end(function (attainmentInfoErr, attainmentInfoRes) {
                        // Handle Attainment error
                        if (attainmentInfoErr) {
                          return done(attainmentInfoErr);
                        }

                        // Set assertions
                        (attainmentInfoRes.body._id).should.equal(attainmentSaveRes.body._id);
                        (attainmentInfoRes.body.name).should.equal(attainment.name);
                        should.equal(attainmentInfoRes.body.user, undefined);

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
      Attainment.remove().exec(done);
    });
  });
});
