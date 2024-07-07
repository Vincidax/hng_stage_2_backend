require('dotenv').config(); // Load environment variables from .env file
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const { clearDatabase } = require('../db/test-db-connections');
const { expect } = chai;

chai.use(chaiHttp);

describe('Auth Endpoints', () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  describe('POST /auth/register', () => {
    it('should register user successfully with default organisation', (done) => {
      const user = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
        phone: '1234567890',
      };

      chai
        .request(server)
        .post('/auth/register')
        .send(user)
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.be.an('object');
          expect(res.body.status).to.equal('success');
          expect(res.body.data.user.firstName).to.equal('John');
          expect(res.body.data.user.email).to.equal('john.doe@example.com');
          expect(res.body.data).to.have.property('accessToken');
          done();
        });
    });

    it('should fail if required fields are missing', (done) => {
      const user = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
      };

      chai
        .request(server)
        .post('/auth/register')
        .send(user)
        .end((err, res) => {
          expect(res).to.have.status(422);
          expect(res.body).to.be.an('object');
          expect(res.body.errors).to.be.an('array');
          expect(res.body.errors[0].param).to.equal('password');
          expect(res.body.errors[0].msg).to.equal('Password must be at least 6 characters long');
          done();
        });
    });

    it('should fail if there is a duplicate email', (done) => {
      const user = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
        phone: '1234567890',
      };

      chai
        .request(server)
        .post('/auth/register')
        .send(user)
        .end(() => {
          chai
            .request(server)
            .post('/auth/register')
            .send(user)
            .end((err, res) => {
              expect(res).to.have.status(400);
              expect(res.body).to.be.an('object');
              expect(res.body.message).to.equal('Email already in use');
              done();
            });
        });
    });
  });

  describe('POST /auth/login', () => {
    it('should log in a user with valid credentials', (done) => {
      const user = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
        phone: '1234567890',
      };

      chai
        .request(server)
        .post('/auth/register')
        .send(user)
        .end(() => {
          chai
            .request(server)
            .post('/auth/login')
            .send({ email: user.email, password: user.password })
            .end((err, res) => {
              expect(res).to.have.status(200);
              expect(res.body).to.be.an('object');
              expect(res.body.status).to.equal('success');
              expect(res.body.data).to.have.property('accessToken');
              done();
            });
        });
    });

    it('should fail to log in a user with invalid credentials', (done) => {
      chai
        .request(server)
        .post('/auth/login')
        .send({ email: 'invalid@example.com', password: 'invalidpassword' })
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body).to.be.an('object');
          expect(res.body.message).to.equal('Authentication failed');
          done();
        });
    });

    it('should fail to log in if required fields are missing', (done) => {
      chai
        .request(server)
        .post('/auth/login')
        .send({ email: 'john.doe@example.com' })
        .end((err, res) => {
          expect(res).to.have.status(422);
          expect(res.body).to.be.an('object');
          expect(res.body.errors).to.be.an('array');
          expect(res.body.errors[0].param).to.equal('password');
          expect(res.body.errors[0].msg).to.equal('Password is required');
          done();
        });
    });
  });
});
