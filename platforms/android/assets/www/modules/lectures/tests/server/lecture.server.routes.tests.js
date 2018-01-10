'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Lecture = mongoose.model('Lecture'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  lecture;

/**
 * Lecture routes tests
 */
describe('Lecture CRUD tests', function () {

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

    // Save a user to the test db and create new Lecture
    user.save(function () {
      lecture = {
        name: 'Lecture name'
      };

      done();
    });
  });

  it('should be able to save a Lecture if logged in', function (done) {
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

        // Save a new Lecture
        agent.post('/api/lectures')
          .send(lecture)
          .expect(200)
          .end(function (lectureSaveErr, lectureSaveRes) {
            // Handle Lecture save error
            if (lectureSaveErr) {
              return done(lectureSaveErr);
            }

            // Get a list of Lectures
            agent.get('/api/lectures')
              .end(function (lecturesGetErr, lecturesGetRes) {
                // Handle Lectures save error
                if (lecturesGetErr) {
                  return done(lecturesGetErr);
                }

                // Get Lectures list
                var lectures = lecturesGetRes.body;

                // Set assertions
                (lectures[0].user._id).should.equal(userId);
                (lectures[0].name).should.match('Lecture name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Lecture if not logged in', function (done) {
    agent.post('/api/lectures')
      .send(lecture)
      .expect(403)
      .end(function (lectureSaveErr, lectureSaveRes) {
        // Call the assertion callback
        done(lectureSaveErr);
      });
  });

  it('should not be able to save an Lecture if no name is provided', function (done) {
    // Invalidate name field
    lecture.name = '';

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

        // Save a new Lecture
        agent.post('/api/lectures')
          .send(lecture)
          .expect(400)
          .end(function (lectureSaveErr, lectureSaveRes) {
            // Set message assertion
            (lectureSaveRes.body.message).should.match('Please fill Lecture name');

            // Handle Lecture save error
            done(lectureSaveErr);
          });
      });
  });

  it('should be able to update an Lecture if signed in', function (done) {
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

        // Save a new Lecture
        agent.post('/api/lectures')
          .send(lecture)
          .expect(200)
          .end(function (lectureSaveErr, lectureSaveRes) {
            // Handle Lecture save error
            if (lectureSaveErr) {
              return done(lectureSaveErr);
            }

            // Update Lecture name
            lecture.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Lecture
            agent.put('/api/lectures/' + lectureSaveRes.body._id)
              .send(lecture)
              .expect(200)
              .end(function (lectureUpdateErr, lectureUpdateRes) {
                // Handle Lecture update error
                if (lectureUpdateErr) {
                  return done(lectureUpdateErr);
                }

                // Set assertions
                (lectureUpdateRes.body._id).should.equal(lectureSaveRes.body._id);
                (lectureUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Lectures if not signed in', function (done) {
    // Create new Lecture model instance
    var lectureObj = new Lecture(lecture);

    // Save the lecture
    lectureObj.save(function () {
      // Request Lectures
      request(app).get('/api/lectures')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Lecture if not signed in', function (done) {
    // Create new Lecture model instance
    var lectureObj = new Lecture(lecture);

    // Save the Lecture
    lectureObj.save(function () {
      request(app).get('/api/lectures/' + lectureObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', lecture.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Lecture with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/lectures/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Lecture is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Lecture which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Lecture
    request(app).get('/api/lectures/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Lecture with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Lecture if signed in', function (done) {
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

        // Save a new Lecture
        agent.post('/api/lectures')
          .send(lecture)
          .expect(200)
          .end(function (lectureSaveErr, lectureSaveRes) {
            // Handle Lecture save error
            if (lectureSaveErr) {
              return done(lectureSaveErr);
            }

            // Delete an existing Lecture
            agent.delete('/api/lectures/' + lectureSaveRes.body._id)
              .send(lecture)
              .expect(200)
              .end(function (lectureDeleteErr, lectureDeleteRes) {
                // Handle lecture error error
                if (lectureDeleteErr) {
                  return done(lectureDeleteErr);
                }

                // Set assertions
                (lectureDeleteRes.body._id).should.equal(lectureSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Lecture if not signed in', function (done) {
    // Set Lecture user
    lecture.user = user;

    // Create new Lecture model instance
    var lectureObj = new Lecture(lecture);

    // Save the Lecture
    lectureObj.save(function () {
      // Try deleting Lecture
      request(app).delete('/api/lectures/' + lectureObj._id)
        .expect(403)
        .end(function (lectureDeleteErr, lectureDeleteRes) {
          // Set message assertion
          (lectureDeleteRes.body.message).should.match('User is not authorized');

          // Handle Lecture error error
          done(lectureDeleteErr);
        });

    });
  });

  it('should be able to get a single Lecture that has an orphaned user reference', function (done) {
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

          // Save a new Lecture
          agent.post('/api/lectures')
            .send(lecture)
            .expect(200)
            .end(function (lectureSaveErr, lectureSaveRes) {
              // Handle Lecture save error
              if (lectureSaveErr) {
                return done(lectureSaveErr);
              }

              // Set assertions on new Lecture
              (lectureSaveRes.body.name).should.equal(lecture.name);
              should.exist(lectureSaveRes.body.user);
              should.equal(lectureSaveRes.body.user._id, orphanId);

              // force the Lecture to have an orphaned user reference
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

                    // Get the Lecture
                    agent.get('/api/lectures/' + lectureSaveRes.body._id)
                      .expect(200)
                      .end(function (lectureInfoErr, lectureInfoRes) {
                        // Handle Lecture error
                        if (lectureInfoErr) {
                          return done(lectureInfoErr);
                        }

                        // Set assertions
                        (lectureInfoRes.body._id).should.equal(lectureSaveRes.body._id);
                        (lectureInfoRes.body.name).should.equal(lecture.name);
                        should.equal(lectureInfoRes.body.user, undefined);

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
      Lecture.remove().exec(done);
    });
  });
});
