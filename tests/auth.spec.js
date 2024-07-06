const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server');

chai.should();
chai.use(chaiHttp);

describe('Auth API', () => {
  describe('POST /auth/register', () => {
    it('should register a new user', (done) => {
      const user = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: '123456',
        phone: '1234567890',
      };

      chai
        .request(app)
        .post('/auth/register')
        .send(user)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eql('success');
          res.body.data.should.have.property('accessToken');
          done();
        });
    });
  });

  describe('POST /auth/login', () => {
    it('should log in an existing user', (done) => {
      const user = {
        email: 'john@example.com',
        password: '123456',
      };

      chai
        .request(app)
        .post('/auth/login')
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eql('success');
          res.body.data.should.have.property('accessToken');
          done();
        });
    });
  });
});
