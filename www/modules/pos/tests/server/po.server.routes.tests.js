'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Po = mongoose.model('Po'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  po;

/**
 * Po routes tests
 */
describe('Po CRUD tests', function () {

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

    // Save a user to the test db and create new Po
    user.save(function () {
      po = {
        name: 'Po name'
      };

      done();
    });
  });

  it('should be able to save a Po if logged in', function (done) {
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

        // Save a new Po
        agent.post('/api/pos')
          .send(po)
          .expect(200)
          .end(function (poSaveErr, poSaveRes) {
            // Handle Po save error
            if (poSaveErr) {
              return done(poSaveErr);
            }

            // Get a list of Pos
            agent.get('/api/pos')
              .end(function (posGetErr, posGetRes) {
                // Handle Pos save error
                if (posGetErr) {
                  return done(posGetErr);
                }

                // Get Pos list
                var pos = posGetRes.body;

                // Set assertions
                (pos[0].user._id).should.equal(userId);
                (pos[0].name).should.match('Po name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Po if not logged in', function (done) {
    agent.post('/api/pos')
      .send(po)
      .expect(403)
      .end(function (poSaveErr, poSaveRes) {
        // Call the assertion callback
        done(poSaveErr);
      });
  });

  it('should not be able to save an Po if no name is provided', function (done) {
    // Invalidate name field
    po.name = '';

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

        // Save a new Po
        agent.post('/api/pos')
          .send(po)
          .expect(400)
          .end(function (poSaveErr, poSaveRes) {
            // Set message assertion
            (poSaveRes.body.message).should.match('Please fill Po name');

            // Handle Po save error
            done(poSaveErr);
          });
      });
  });

  it('should be able to update an Po if signed in', function (done) {
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

        // Save a new Po
        agent.post('/api/pos')
          .send(po)
          .expect(200)
          .end(function (poSaveErr, poSaveRes) {
            // Handle Po save error
            if (poSaveErr) {
              return done(poSaveErr);
            }

            // Update Po name
            po.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Po
            agent.put('/api/pos/' + poSaveRes.body._id)
              .send(po)
              .expect(200)
              .end(function (poUpdateErr, poUpdateRes) {
                // Handle Po update error
                if (poUpdateErr) {
                  return done(poUpdateErr);
                }

                // Set assertions
                (poUpdateRes.body._id).should.equal(poSaveRes.body._id);
                (poUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Pos if not signed in', function (done) {
    // Create new Po model instance
    var poObj = new Po(po);

    // Save the po
    poObj.save(function () {
      // Request Pos
      request(app).get('/api/pos')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Po if not signed in', function (done) {
    // Create new Po model instance
    var poObj = new Po(po);

    // Save the Po
    poObj.save(function () {
      request(app).get('/api/pos/' + poObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', po.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Po with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/pos/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Po is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Po which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Po
    request(app).get('/api/pos/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Po with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Po if signed in', function (done) {
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

        // Save a new Po
        agent.post('/api/pos')
          .send(po)
          .expect(200)
          .end(function (poSaveErr, poSaveRes) {
            // Handle Po save error
            if (poSaveErr) {
              return done(poSaveErr);
            }

            // Delete an existing Po
            agent.delete('/api/pos/' + poSaveRes.body._id)
              .send(po)
              .expect(200)
              .end(function (poDeleteErr, poDeleteRes) {
                // Handle po error error
                if (poDeleteErr) {
                  return done(poDeleteErr);
                }

                // Set assertions
                (poDeleteRes.body._id).should.equal(poSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Po if not signed in', function (done) {
    // Set Po user
    po.user = user;

    // Create new Po model instance
    var poObj = new Po(po);

    // Save the Po
    poObj.save(function () {
      // Try deleting Po
      request(app).delete('/api/pos/' + poObj._id)
        .expect(403)
        .end(function (poDeleteErr, poDeleteRes) {
          // Set message assertion
          (poDeleteRes.body.message).should.match('User is not authorized');

          // Handle Po error error
          done(poDeleteErr);
        });

    });
  });

  it('should be able to get a single Po that has an orphaned user reference', function (done) {
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

          // Save a new Po
          agent.post('/api/pos')
            .send(po)
            .expect(200)
            .end(function (poSaveErr, poSaveRes) {
              // Handle Po save error
              if (poSaveErr) {
                return done(poSaveErr);
              }

              // Set assertions on new Po
              (poSaveRes.body.name).should.equal(po.name);
              should.exist(poSaveRes.body.user);
              should.equal(poSaveRes.body.user._id, orphanId);

              // force the Po to have an orphaned user reference
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

                    // Get the Po
                    agent.get('/api/pos/' + poSaveRes.body._id)
                      .expect(200)
                      .end(function (poInfoErr, poInfoRes) {
                        // Handle Po error
                        if (poInfoErr) {
                          return done(poInfoErr);
                        }

                        // Set assertions
                        (poInfoRes.body._id).should.equal(poSaveRes.body._id);
                        (poInfoRes.body.name).should.equal(po.name);
                        should.equal(poInfoRes.body.user, undefined);

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
      Po.remove().exec(done);
    });
  });
});
