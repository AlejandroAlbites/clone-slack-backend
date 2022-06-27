const request = require('supertest');
const { connect, disconnected, cleanup } = require('../db');
const Server = require('../models/server');
const User = require('../models/user.model');
const WorkSpace = require('../models/workspace.model');
const jwt = require('jsonwebtoken');
// const server = require('../../index');
const server = new Server();

describe('Workspace', () => {
  let workspace;
  let user;
  let token;

  beforeAll(async () => {
    await connect();
    await server.execute();
  }, 100000);

  beforeEach(async () => {
    await cleanup();

    workspace = new WorkSpace({ name: 'workspace Test' });
    await workspace.save({ validateBeforeSave: false });

    const data = {
      fullName: 'Prueba',
      email: 'test02@test.com',
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

  it('Should list all workspaces', async () => {
    const res = await request(server.app)
      .get('/workSpace')
      .set('x-token', token);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/Work Space found/i);
  });

  it('Should not list all workspaces because the token is invalid', async () => {
    const res = await request(server.app)
      .get('/workSpace')
      .set(
        'x-token',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI2MmI0YTBlODM5Y2E3ODY3MzZmZWZmYWIiLCJmdWxsTmFtZSI6IkVkaW5hZWwgU2FuZ3Vpbm8iLCJlbWFpbCI6ImVkaW5hZWxAbWFpbC5jb20iLCJpYXQiOjE2NTYyMTI1MjUsImV4cCI6MTY1NjI5ODkyNX0.iGivC1-AkoN3g62uAYf8BJOCZoSzUS8zs44Q66Fe2Qo'
      );

    expect(res.statusCode).toBe(404);
    expect(res.body.data).toMatch(/User not found/i);
  });

  it('Should create a workspace correctly', async () => {
    const workspaceRegister = {
      name: 'work New',
    };
    const res = await request(server.app)
      .post('/workSpace')
      .set('x-token', token)
      .send(workspaceRegister);

    expect(res.statusCode).toBe(200);
    expect(res.body.msg).toMatch(/WorkSpace created/i);
  });

  it('Should not create a workspace because there is not token', async () => {
    const workspaceRegister = {
      name: 'work New',
    };
    const res = await request(server.app)
      .post('/workSpace')
      .send(workspaceRegister);

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toMatch(/there is no token in the request/i);
  });

  it('Should not create a workspace because the token is invalid', async () => {
    const workspaceRegister = {
      name: 'work New',
    };
    const res = await request(server.app)
      .post('/workSpace')
      .set(
        'x-token',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI2MmI0YTBlODM5Y2E3ODY3MzZmZWZmYWIiLCJmdWxsTmFtZSI6IkVkaW5hZWwgU2FuZ3Vpbm8iLCJlbWFpbCI6ImVkaW5hZWxAbWFpbC5jb20iLCJpYXQiOjE2NTYyMTI1MjUsImV4cCI6MTY1NjI5ODkyNX0.iGivC1-AkoN3g62uAYf8BJOCZoSzUS8zs44Q66Fe2Qo'
      )
      .send(workspaceRegister);

    expect(res.statusCode).toBe(500);
    expect(res.body.msgError).toMatch(/User not found/i);
  });

  it('Should add a new user to a workspace', async () => {
    const workSpaceId = {
      workspaceId: workspace._id,
    };

    const res = await request(server.app)
      .put('/workSpace')
      .send(workSpaceId)
      .set('x-token', token);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/WorkSpace updated/i);
  });

  it('Should not add a new user to a workspace because the workspace is invalid', async () => {
    const workSpaceId = {
      workspaceId: '62b7ce6f3cc7026fcda86f78',
    };

    const res = await request(server.app)
      .put('/workSpace')
      .send(workSpaceId)
      .set('x-token', token);

    expect(res.statusCode).toBe(404);
    expect(res.body.data).toMatch(/Invalid workspace/i);
  });

  it('Should not add a new user to a workspace because the token is invalid', async () => {
    const workSpaceId = {
      workspaceId: workspace._id,
    };

    const res = await request(server.app)
      .put('/workSpace')
      .send(workSpaceId)
      .set(
        'x-token',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI2MmI0YTBlODM5Y2E3ODY3MzZmZWZmYWIiLCJmdWxsTmFtZSI6IkVkaW5hZWwgU2FuZ3Vpbm8iLCJlbWFpbCI6ImVkaW5hZWxAbWFpbC5jb20iLCJpYXQiOjE2NTYyMTI1MjUsImV4cCI6MTY1NjI5ODkyNX0.iGivC1-AkoN3g62uAYf8BJOCZoSzUS8zs44Q66Fe2Qo'
      );

    expect(res.statusCode).toBe(404);
    expect(res.body.data).toMatch(/Invalid user/i);
  });
});
