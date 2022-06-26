const request = require('supertest');
const { connect, disconnected, cleanup } = require('../db');
const Server = require('../models/server');
const User = require('../models/user.model');
const WorkSpace = require('../models/workSpace.model');
const jwt = require('jsonwebtoken');

const server = new Server();

describe('User', () => {
  let workspace;
  let user;
  let token;

  beforeAll(async () => {
    await connect();
    await server.execute();
  }, 100000);
  
  beforeEach(async () => {
    await cleanup();

    workspace = new WorkSpace({ name: 'workspace' });
    workspace.save({ validateBeforeSave: false });

    const data = {
      fullName: 'Prueba',
      email: 'test@test.com',
      password: '12345678Aa',
    };
    user = await User.create(data);

    token = jwt.sign(
      { uid: user._id, fullName: user.fullName, email: user.email },
      process.env.SECRET_JWT_SEED_SLACK,
      {
        expiresIn: 60 * 60 * 24 * 365,
      }
    );
  }, 100000);

  afterAll(async () => {
    await disconnected();
  }, 100000);

  it('should create a user correctly', async () => {
    const userRegister = {
      fullName: 'sujeto Prueba',
      email: 'test22@test.com',
      password: '123456Aa',
      workSpaceId: workspace._id,
    };
    const res = await request(server.app)
      .post('/users/register')
      .send(userRegister);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.token).toMatch(
      /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/
    );
    expect(res.body.message).toMatch(/User created/i);
  }, 15000);

  it('should not create a user because de email format is wrong', async () => {
    const userRegister = {
      fullName: 'sujeto Prueba',
      email: 'test@test.com',
      password: '123456Aa',
      workSpaceId: workspace._id,
    };
    const res = await request(server.app)
      .post('/users/register')
      .send(userRegister);

    expect(res.statusCode).toBe(404);
    expect(res.body.data).toMatch(/There is already a user with that email/i);
  }, 15000);

  it('should not create a user because workspace is wrong', async () => {
    const userRegister = {
      fullName: 'sujeto Prueba',
      email: 'test1@test.com',
      password: '123456Aa',
      workSpaceId: '62b747c12f1814fe2cd1d7d3',
    };
    const res = await request(server.app)
      .post('/users/register')
      .send(userRegister);

    expect(res.statusCode).toBe(404);
    expect(res.body.data).toMatch(/Invalid workspace/i);
  });

  it('should log a user correctly', async () => {
    const userRegister = {
      fullName: 'sujeto Prueba',
      email: 'test22@test.com',
      password: '123456Aa',
      workSpaceId: workspace._id,
    };
    await request(server.app).post('/users/register').send(userRegister);

    const userLogin = {
      email: 'test22@test.com',
      password: '123456Aa',
    };
    const res = await request(server.app).post('/users/login').send(userLogin);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/Login successful/i);
    expect(res.body).toHaveProperty('token');
    expect(res.body.token).toMatch(
      /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/
    );
  });

  it('should not log a user because user does not exist', async () => {
    const userLogin = {
      email: 'test99@test.com',
      password: '123456Aa',
    };
    const res = await request(server.app).post('/users/login').send(userLogin);

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/the email or password is not correct/i);
  });

  it('should not log a user because user password is not correct', async () => {
    const userRegister = {
      fullName: 'sujeto Prueba',
      email: 'test22@test.com',
      password: '123456Aa',
      workSpaceId: workspace._id,
    };
    await request(server.app).post('/users/register').send(userRegister);

    const userLogin = {
      email: 'test22@test.com',
      password: '123456789Aa',
    };
    const res = await request(server.app).post('/users/login').send(userLogin);

    expect(res.statusCode).toBe(500);
    expect(res.body.data).toMatch(/the email or password is not correct/i);
  });

  it('should list users', async () => {
    const res = await request(server.app).get('/users');

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/Users found/i);
  });

  it('should get user by id', async () => {
    const res = await request(server.app)
      .get('/users/user/')
      .set('x-token', token);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/User found/i);
  });

  it('should not get user because id is invalid', async () => {
    const res = await request(server.app)
      .get('/users/user/')
      .set(
        'x-token',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI2MmI3YjA5MDQwZTQyZmNiNWZiMzg0ZTUiLCJmdWxsTmFtZSI6InN1amV0byBQcnVlYmEiLCJlbWFpbCI6InRlc3QyMUB0ZXN0LmNvbSIsImlhdCI6MTY1NjIwNTQ1NiwiZXhwIjoxNjU2MjkxODU2fQ.FHMJ-Thxa9OWsGYPMt8EMqI4g86iJ7kc3lQCNFOnabw'
      );

    expect(res.statusCode).toBe(404);
    expect(res.body.data).toMatch(/User not found/i);
  });

  it('should not get user by id because token is invalid', async () => {
    const res = await request(server.app)
      .get('/users/user/')
      .set(
        'x-token',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyYjExYzczYTRiYWE1MjRiOTYyYmRmOSIsImlhdCI6MTY1NTg2MDg1OSwiZXhwIjoxNjU1OTQ3MjU5fQ.rJEreGFTYZOgZAhG6Jnm_TuHVun0QSjNmQDzWoBZZHI'
      );

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toMatch(/invalid token/i);
  });

  it('should revalidate token', async () => {
    const res = await request(server.app)
      .get('/users/renew')
      .set('x-token', token);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/token revalidated/i);
  });

  it('should update a user correctly', async () => {
    const userUpdate = {
      fullName: 'sujeto',
      description: 'descripcion',
      phone: '132151515',
      occupation: 'Software Engineer',
    };

    const res = await request(server.app)
      .put('/users/edit')
      .send(userUpdate)
      .set('x-token', token);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/User updated/i);
  });

  it('should not update user because token is invalid', async () => {
    const userUpdate = {
      fullName: 's',
      description: 'descripcion',
      phone: '132151515',
      occupation: 'Software Engineer',
    };

    const res = await request(server.app)
      .put('/users/edit')
      .send(userUpdate)
      .set('x-token', token);

    expect(res.statusCode).toBe(500);
    expect(res.body.message).toMatch(/User could not be update/i);
  });

  it('should not change password because oldPassword is invalid', async () => {
    const userUpdate = {
      oldPassword: '123456Aa',
      repeatPassword: '1234567Aa',
    };

    const res = await request(server.app)
      .put('/users/change-password')
      .send(userUpdate)
      .set('x-token', token);

    expect(res.statusCode).toBe(500);
    expect(res.body.message).toMatch(/User could not be update/i);
  });

  it('should change password correctly', async () => {
    const userRegister = {
      fullName: 'sujeto Prueba',
      email: 'test55@test.com',
      password: '123456Aa',
      workSpaceId: workspace._id,
    };
    const resUser = await request(server.app)
      .post('/users/register')
      .send(userRegister);

    const userUpdate = {
      oldPassword: '123456Aa',
      repeatPassword: '1234567Aa',
    };

    const res = await request(server.app)
      .put('/users/change-password')
      .send(userUpdate)
      .set('x-token', resUser.body.token);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/User updated/i);
  }, 10000);

  it('should not change password because token is invalid', async () => {
    const userUpdate = {
      oldPassword: '12345678Aa',
      repeatPassword: '1234567Aa',
    };

    const res = await request(server.app)
      .put('/users/change-password')
      .send(userUpdate)
      .set(
        'x-token',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI2MmI0YTBlODM5Y2E3ODY3MzZmZWZmYWIiLCJmdWxsTmFtZSI6IkVkaW5hZWwgU2FuZ3Vpbm8iLCJlbWFpbCI6ImVkaW5hZWxAbWFpbC5jb20iLCJpYXQiOjE2NTYyMTI1MjUsImV4cCI6MTY1NjI5ODkyNX0.iGivC1-AkoN3g62uAYf8BJOCZoSzUS8zs44Q66Fe2Qo'
      );

    expect(res.statusCode).toBe(500);
    expect(res.body.data).toMatch(/User not found/i);
  });

  it('should send email for change password correctly', async () => {
    const userUpdate = {
      email: 'test@test.com',
    };

    const res = await request(server.app)
      .post('/users/forgot-password')
      .send(userUpdate);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/Email sent/i);
  });

  it('should not send email for change password because email is invalid', async () => {
    const userUpdate = {
      email: 'test44@test.com',
    };

    const res = await request(server.app)
      .post('/users/forgot-password')
      .send(userUpdate);

    expect(res.statusCode).toBe(500);
    expect(res.body.message).toMatch(/Email could not be sent/i);
    expect(res.body.data).toMatch(/User not found/i);
  });

  it('should recover password correctly', async () => {
    const userRegister = {
      fullName: 'sujeto Prueba',
      email: 'test77@test.com',
      password: '123456Aa',
      workSpaceId: workspace._id,
    };

    const resUser = await request(server.app)
      .post('/users/register')
      .send(userRegister);

    const resetPassword = {
      token: resUser.body.token,
      newPassword: '1234567Aa',
    };

    const res = await request(server.app)
      .put('/users/reset-password')
      .send(resetPassword);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/Password updated/i);
  }, 15000);

  it('should not recover password because token is invalid', async () => {
    const resetPassword = {
      token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI2MmI0YTBlODM5Y2E3ODY3MzZmZWZmYWIiLCJmdWxsTmFtZSI6IkVkaW5hZWwgU2FuZ3Vpbm8iLCJlbWFpbCI6ImVkaW5hZWxAbWFpbC5jb20iLCJpYXQiOjE2NTYyMTI1MjUsImV4cCI6MTY1NjI5ODkyNX0.iGivC1-AkoN3g62uAYf8BJOCZoSzUS8zs44Q66Fe2Qo',
      newPassword: '1234567Aa',
    };

    const res = await request(server.app)
      .put('/users/reset-password')
      .send(resetPassword);

    expect(res.statusCode).toBe(500);
    expect(res.body.data).toMatch(/User not found/i);
  }, 15000);

  it('should change user to premium', async () => {
    const res = await request(server.app)
      .put('/users/premium')
      .set('x-token', token);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/User updated/i);
  }, 15000);

  it('should not change user to premium because token is invalid', async () => {
    const res = await request(server.app)
      .put('/users/premium')
      .set(
        'x-token',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI2MmI0YTBlODM5Y2E3ODY3MzZmZWZmYWIiLCJmdWxsTmFtZSI6IkVkaW5hZWwgU2FuZ3Vpbm8iLCJlbWFpbCI6ImVkaW5hZWxAbWFpbC5jb20iLCJpYXQiOjE2NTYyMTI1MjUsImV4cCI6MTY1NjI5ODkyNX0.iGivC1-AkoN3g62uAYf8BJOCZoSzUS8zs44Q66Fe2Qo'
      );

    expect(res.statusCode).toBe(500);
    expect(res.body.data).toMatch(/User not found/i);
  });

  it('should delete user', async () => {
    const res = await request(server.app)
      .delete(`/users/${user._id}`)
      .set('x-token', token);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/User deleted/i);
  });

  it('should not delete user because user is invalid', async () => {
    const res = await request(server.app)
      .delete(`/users/62b7d1de1fcc8590ca75cbf2`)
      .set('x-token', token);

    expect(res.statusCode).toBe(404);
    expect(res.body.data).toMatch(/User not found/i);
  });
});
