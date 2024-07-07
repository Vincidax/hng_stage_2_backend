require('dotenv').config(); // Load environment variables from .env file
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const { clearDatabase } = require('../db/test-db-connections');
const { expect } = chai;

chai.use(chaiHttp);

describe('User Endpoints', () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  describe('GET /api/users/:id', () => {
    it('should get user by ID', (done) => {
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
          const userId = res.body.data.user.userId;
          const token = res.body.data.accessToken;

          chai
            .request(server)
            .get(`/api/users/${userId}`)
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
              expect(res).to.have.status(200);
              expect(res.body).to.be.an('object');
              expect(res.body.status).to.equal('success');
              expect(res.body.data.email).to.equal('john.doe@example.com');
              done();
            });
        });
    });

    it('should not get user if unauthorized', (done) => {
      chai
        .request(server)
        .get('/api/users/123')
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body).to.be.an('object');
          expect(res.body.message).to.equal('Access denied, token missing!');
          done();
        });
    });
  });
});