const request = require('supertest');
const { connect, disconnected, cleanup } = require('../db');
const Server = require('../models/server');
const User = require('../models/user.model');
const WorkSpace = require('../models/workspace.model');
const Channel = require('../models/channel.model');
const jwt = require('jsonwebtoken');
const {
  userConnected,
  statusChanged,
  userDisconnected,
  saveMessage,
  getAllMessagesChannel,
  saveThreadMessage,
} = require('../controllers/socket.controller');
const { checkJWT, JWTgenerator } = require('../helpers/jwt');

const server = new Server();

describe('Channels', () => {
  let workspace;
  let user;
  let message;

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

    const newMessage = {
      from: user._id,
      to: user._id,
      message: 'Hello',
      workSpaceId: workspace._id,
      image: 'Hello',
      fullName: user.fullName,
    };
    message = await saveMessage(newMessage);
  }, 100000);

  afterAll(async () => {
    await disconnected();
  }, 100000);

  it('should change userState to enable', async () => {
    const userResult = await userConnected(user._id);
    expect(userResult.state).toBe('enable');
  });

  it('should not change userState to enable because user is invalid', async () => {
    const userResult = await userConnected('62b7d1de1fcc8590ca75cbf2');
    expect(userResult).toBe('User not found');
  });

  it('should change userState to away', async () => {
    const userResult = await statusChanged(user._id, 'away');
    expect(userResult.state).toBe('away');
  });

  it('should not change userState to away because user is invalid', async () => {
    const userResult = await statusChanged('62b7d1de1fcc8590ca75cbf2', 'away');
    expect(userResult).toBe('User not found');
  });

  it('should change userState to disable', async () => {
    const userResult = await userDisconnected(user._id);
    expect(userResult.state).toBe('disable');
  });

  it('should not change userState to disable because user is invalid', async () => {
    const userResult = await userDisconnected('62b7d1de1fcc8590ca75cbf2');
    expect(userResult).toBe('User not found');
  });

  it('should save message correctly', async () => {
    const newMessage = {
      from: user._id,
      to: user._id,
      message: 'Hello',
      workSpaceId: workspace._id,
      image: 'Hello',
      fullName: user.fullName,
    };
    const messageResult = await saveMessage(newMessage);
    expect(messageResult).toBe(messageResult);
  });

  it('should save message correctly', async () => {
    const messageResult = await getAllMessagesChannel(user._id);
    expect(messageResult).toBe(messageResult);
  });

  it('should save thread message correctly', async () => {
    const newThreadMessage = {
      from: user._id,
      to: user._id,
      message: 'Hello',
      image: 'Hello',
      fullName: user.fullName,
    };
    const messageResult = await saveThreadMessage(newThreadMessage);
    expect(messageResult).toBe(messageResult);
  });

  it('should not save thread message because message is invalid', async () => {
    const newThreadMessage = {
      from: user._id,
      to: '62b7d1de1fcc8590ca75cbf2',
      message: 'Hello',
      image: 'Hello',
      fullName: user.fullName,
    };
    const messageResult = await saveThreadMessage(newThreadMessage);
    expect(messageResult).toBe('Invalid message');
  });

  it('should test checkJWT', async () => {
    const jwt = await checkJWT(
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI2MmI0YTBlODM5Y2E3ODY3MzZmZWZmYWIiLCJmdWxsTmFtZSI6IkVkaW5hZWwgU2FuZ3Vpbm8iLCJlbWFpbCI6ImVkaW5hZWxAbWFpbC5jb20iLCJpYXQiOjE2NTYyMTI1MjUsImV4cCI6MTY1NjI5ODkyNX0.iGivC1-AkoN3g62uAYf8BJOCZoSzUS8zs44Q66Fe2Qo'
    );
    expect(jwt[0]).toBe(true);
  });

  it('should not test checkJWT because jwt is not valid', async () => {
    const jwt = await checkJWT(
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkJXVCM9.eyJ1aWQiOiI2MmI0YTBlODM5Y2E3ODY3MzZmZWZmYWIiLCJmdWxsTmFtZSI6IkVkaW5hZWwgU2FuZ3Vpbm8iLCJlbWFpbCI6ImVkaW5hZWxAbWFpbC5jb20iLCJpYXQiOjE2NTYyMTI1MjUsImV4cCI6MTY1NjI5ODkyNX0.iGivC1-AkoN3g62uAYf8BJOCZoSzUS8zs44Q66Fe2Qo'
    );
    expect(jwt[0]).toBe(false);
  });
});
