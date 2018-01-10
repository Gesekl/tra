'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Batch = mongoose.model('Batch'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  batch;

/**
 * Batch routes tests
 */
describe('Batch CRUD tests', function () {

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

    // Save a user to the test db and create new Batch
    user.save(function () {
      batch = {
        name: 'Batch name'
      };

      done();
    });
  });

  it('should be able to save a Batch if logged in', function (done) {
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

        // Save a new Batch
        agent.post('/api/batches')
          .send(batch)
          .expect(200)
          .end(function (batchSaveErr, batchSaveRes) {
            // Handle Batch save error
            if (batchSaveErr) {
              return done(batchSaveErr);
            }

            // Get a list of Batches
            agent.get('/api/batches')
              .end(function (batchesGetErr, batchesGetRes) {
                // Handle Batches save error
                if (batchesGetErr) {
                  return done(batchesGetErr);
                }

                // Get Batches list
                var batches = batchesGetRes.body;

                // Set assertions
                (batches[0].user._id).should.equal(userId);
                (batches[0].name).should.match('Batch name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Batch if not logged in', function (done) {
    agent.post('/api/batches')
      .send(batch)
      .expect(403)
      .end(function (batchSaveErr, batchSaveRes) {
        // Call the assertion callback
        done(batchSaveErr);
      });
  });

  it('should not be able to save an Batch if no name is provided', function (done) {
    // Invalidate name field
    batch.name = '';

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

        // Save a new Batch
        agent.post('/api/batches')
          .send(batch)
          .expect(400)
          .end(function (batchSaveErr, batchSaveRes) {
            // Set message assertion
            (batchSaveRes.body.message).should.match('Please fill Batch name');

            // Handle Batch save error
            done(batchSaveErr);
          });
      });
  });

  it('should be able to update an Batch if signed in', function (done) {
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

        // Save a new Batch
        agent.post('/api/batches')
          .send(batch)
          .expect(200)
          .end(function (batchSaveErr, batchSaveRes) {
            // Handle Batch save error
            if (batchSaveErr) {
              return done(batchSaveErr);
            }

            // Update Batch name
            batch.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Batch
            agent.put('/api/batches/' + batchSaveRes.body._id)
              .send(batch)
              .expect(200)
              .end(function (batchUpdateErr, batchUpdateRes) {
                // Handle Batch update error
                if (batchUpdateErr) {
                  return done(batchUpdateErr);
                }

                // Set assertions
                (batchUpdateRes.body._id).should.equal(batchSaveRes.body._id);
                (batchUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Batches if not signed in', function (done) {
    // Create new Batch model instance
    var batchObj = new Batch(batch);

    // Save the batch
    batchObj.save(function () {
      // Request Batches
      request(app).get('/api/batches')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Batch if not signed in', function (done) {
    // Create new Batch model instance
    var batchObj = new Batch(batch);

    // Save the Batch
    batchObj.save(function () {
      request(app).get('/api/batches/' + batchObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', batch.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Batch with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/batches/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Batch is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Batch which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Batch
    request(app).get('/api/batches/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Batch with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Batch if signed in', function (done) {
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

        // Save a new Batch
        agent.post('/api/batches')
          .send(batch)
          .expect(200)
          .end(function (batchSaveErr, batchSaveRes) {
            // Handle Batch save error
            if (batchSaveErr) {
              return done(batchSaveErr);
            }

            // Delete an existing Batch
            agent.delete('/api/batches/' + batchSaveRes.body._id)
              .send(batch)
              .expect(200)
              .end(function (batchDeleteErr, batchDeleteRes) {
                // Handle batch error error
                if (batchDeleteErr) {
                  return done(batchDeleteErr);
                }

                // Set assertions
                (batchDeleteRes.body._id).should.equal(batchSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Batch if not signed in', function (done) {
    // Set Batch user
    batch.user = user;

    // Create new Batch model instance
    var batchObj = new Batch(batch);

    // Save the Batch
    batchObj.save(function () {
      // Try deleting Batch
      request(app).delete('/api/batches/' + batchObj._id)
        .expect(403)
        .end(function (batchDeleteErr, batchDeleteRes) {
          // Set message assertion
          (batchDeleteRes.body.message).should.match('User is not authorized');

          // Handle Batch error error
          done(batchDeleteErr);
        });

    });
  });

  it('should be able to get a single Batch that has an orphaned user reference', function (done) {
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

          // Save a new Batch
          agent.post('/api/batches')
            .send(batch)
            .expect(200)
            .end(function (batchSaveErr, batchSaveRes) {
              // Handle Batch save error
              if (batchSaveErr) {
                return done(batchSaveErr);
              }

              // Set assertions on new Batch
              (batchSaveRes.body.name).should.equal(batch.name);
              should.exist(batchSaveRes.body.user);
              should.equal(batchSaveRes.body.user._id, orphanId);

              // force the Batch to have an orphaned user reference
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

                    // Get the Batch
                    agent.get('/api/batches/' + batchSaveRes.body._id)
                      .expect(200)
                      .end(function (batchInfoErr, batchInfoRes) {
                        // Handle Batch error
                        if (batchInfoErr) {
                          return done(batchInfoErr);
                        }

                        // Set assertions
                        (batchInfoRes.body._id).should.equal(batchSaveRes.body._id);
                        (batchInfoRes.body.name).should.equal(batch.name);
                        should.equal(batchInfoRes.body.user, undefined);

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
      Batch.remove().exec(done);
    });
  });
});
