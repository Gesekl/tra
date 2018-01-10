'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Pso = mongoose.model('Pso'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  pso;

/**
 * Pso routes tests
 */
describe('Pso CRUD tests', function () {

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

    // Save a user to the test db and create new Pso
    user.save(function () {
      pso = {
        name: 'Pso name'
      };

      done();
    });
  });

  it('should be able to save a Pso if logged in', function (done) {
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

        // Save a new Pso
        agent.post('/api/psos')
          .send(pso)
          .expect(200)
          .end(function (psoSaveErr, psoSaveRes) {
            // Handle Pso save error
            if (psoSaveErr) {
              return done(psoSaveErr);
            }

            // Get a list of Psos
            agent.get('/api/psos')
              .end(function (psosGetErr, psosGetRes) {
                // Handle Psos save error
                if (psosGetErr) {
                  return done(psosGetErr);
                }

                // Get Psos list
                var psos = psosGetRes.body;

                // Set assertions
                (psos[0].user._id).should.equal(userId);
                (psos[0].name).should.match('Pso name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Pso if not logged in', function (done) {
    agent.post('/api/psos')
      .send(pso)
      .expect(403)
      .end(function (psoSaveErr, psoSaveRes) {
        // Call the assertion callback
        done(psoSaveErr);
      });
  });

  it('should not be able to save an Pso if no name is provided', function (done) {
    // Invalidate name field
    pso.name = '';

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

        // Save a new Pso
        agent.post('/api/psos')
          .send(pso)
          .expect(400)
          .end(function (psoSaveErr, psoSaveRes) {
            // Set message assertion
            (psoSaveRes.body.message).should.match('Please fill Pso name');

            // Handle Pso save error
            done(psoSaveErr);
          });
      });
  });

  it('should be able to update an Pso if signed in', function (done) {
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

        // Save a new Pso
        agent.post('/api/psos')
          .send(pso)
          .expect(200)
          .end(function (psoSaveErr, psoSaveRes) {
            // Handle Pso save error
            if (psoSaveErr) {
              return done(psoSaveErr);
            }

            // Update Pso name
            pso.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Pso
            agent.put('/api/psos/' + psoSaveRes.body._id)
              .send(pso)
              .expect(200)
              .end(function (psoUpdateErr, psoUpdateRes) {
                // Handle Pso update error
                if (psoUpdateErr) {
                  return done(psoUpdateErr);
                }

                // Set assertions
                (psoUpdateRes.body._id).should.equal(psoSaveRes.body._id);
                (psoUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Psos if not signed in', function (done) {
    // Create new Pso model instance
    var psoObj = new Pso(pso);

    // Save the pso
    psoObj.save(function () {
      // Request Psos
      request(app).get('/api/psos')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Pso if not signed in', function (done) {
    // Create new Pso model instance
    var psoObj = new Pso(pso);

    // Save the Pso
    psoObj.save(function () {
      request(app).get('/api/psos/' + psoObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', pso.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Pso with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/psos/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Pso is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Pso which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Pso
    request(app).get('/api/psos/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Pso with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Pso if signed in', function (done) {
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

        // Save a new Pso
        agent.post('/api/psos')
          .send(pso)
          .expect(200)
          .end(function (psoSaveErr, psoSaveRes) {
            // Handle Pso save error
            if (psoSaveErr) {
              return done(psoSaveErr);
            }

            // Delete an existing Pso
            agent.delete('/api/psos/' + psoSaveRes.body._id)
              .send(pso)
              .expect(200)
              .end(function (psoDeleteErr, psoDeleteRes) {
                // Handle pso error error
                if (psoDeleteErr) {
                  return done(psoDeleteErr);
                }

                // Set assertions
                (psoDeleteRes.body._id).should.equal(psoSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Pso if not signed in', function (done) {
    // Set Pso user
    pso.user = user;

    // Create new Pso model instance
    var psoObj = new Pso(pso);

    // Save the Pso
    psoObj.save(function () {
      // Try deleting Pso
      request(app).delete('/api/psos/' + psoObj._id)
        .expect(403)
        .end(function (psoDeleteErr, psoDeleteRes) {
          // Set message assertion
          (psoDeleteRes.body.message).should.match('User is not authorized');

          // Handle Pso error error
          done(psoDeleteErr);
        });

    });
  });

  it('should be able to get a single Pso that has an orphaned user reference', function (done) {
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

          // Save a new Pso
          agent.post('/api/psos')
            .send(pso)
            .expect(200)
            .end(function (psoSaveErr, psoSaveRes) {
              // Handle Pso save error
              if (psoSaveErr) {
                return done(psoSaveErr);
              }

              // Set assertions on new Pso
              (psoSaveRes.body.name).should.equal(pso.name);
              should.exist(psoSaveRes.body.user);
              should.equal(psoSaveRes.body.user._id, orphanId);

              // force the Pso to have an orphaned user reference
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

                    // Get the Pso
                    agent.get('/api/psos/' + psoSaveRes.body._id)
                      .expect(200)
                      .end(function (psoInfoErr, psoInfoRes) {
                        // Handle Pso error
                        if (psoInfoErr) {
                          return done(psoInfoErr);
                        }

                        // Set assertions
                        (psoInfoRes.body._id).should.equal(psoSaveRes.body._id);
                        (psoInfoRes.body.name).should.equal(pso.name);
                        should.equal(psoInfoRes.body.user, undefined);

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
      Pso.remove().exec(done);
    });
  });
});
