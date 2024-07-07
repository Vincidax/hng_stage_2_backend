require('dotenv').config(); // Load environment variables from .env file
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const { clearDatabase } = require('../db/test-db-connections');
const { expect } = chai;

chai.use(chaiHttp);

describe('Organisation Endpoints', () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  describe('POST /api/organisations', () => {
    it('should create an organisation', (done) => {
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
          const token = res.body.data.accessToken;

          chai
            .request(server)
            .post('/api/organisations')
            .set('Authorization', `Bearer ${token}`)
            .send({ name: "John's Organisation", description: 'A test org' })
            .end((err, res) => {
              expect(res).to.have.status(201);
              expect(res.body).to.be.an('object');
              expect(res.body.status).to.equal('success');
              expect(res.body.data.name).to.equal("John's Organisation");
              done();
            });
        });
    });

    it('should not create organisation if name is missing', (done) => {
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
          const token = res.body.data.accessToken;

          chai
            .request(server)
            .post('/api/organisations')
            .set('Authorization', `Bearer ${token}`)
            .send({ description: 'A test org' })
            .end((err, res) => {
              expect(res).to.have.status(422);
              expect(res.body).to.be.an('object');
              expect(res.body.errors[0].param).to.equal('name');
              expect(res.body.errors[0].msg).to.equal('Organisation name is required');
              done();
            });
        });
    });
  });

  describe('GET /api/organisations', () => {
    it('should get all organisations for the logged-in user', (done) => {
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
          const token = res.body.data.accessToken;

          chai
            .request(server)
            .get('/api/organisations')
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
              expect(res).to.have.status(200);
              expect(res.body).to.be.an('object');
              expect(res.body.status).to.equal('success');
              expect(res.body.data.organisations).to.be.an('array');
              done();
            });
        });
    });

    it('should not get organisations if unauthorized', (done) => {
      chai
        .request(server)
        .get('/api/organisations')
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body).to.be.an('object');
          expect(res.body.message).to.equal('Access denied, token missing!');
          done();
        });
    });
  });
});