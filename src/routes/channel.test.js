const request = require('supertest');
const { connect, disconnected, cleanup } = require('../db');
const Server = require('../models/server');
const User = require('../models/user.model');
const WorkSpace = require('../models/workSpace.model');
const Channel = require('../models/channel.model');
const jwt = require('jsonwebtoken');

const server = new Server();

describe('Channels', () => {
  let workspace;
  let user;
  let token;
  let channel;

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

    const channelData = {
      name: 'channel',
      workSpaceId: workspace._id,
      users: user._id,
    };
    channel = await Channel.create(channelData);
  }, 100000);

  afterAll(async () => {
    await disconnected();
  }, 100000);

  it('should list all channels', async () => {
    const res = await request(server.app).get('/channels');

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/Channels found/i);
  });

  it('should show channel', async () => {
    const res = await request(server.app).get(`/channels/${channel._id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/Channel found/i);
  });

  it('should not show channel because its id is invalid', async () => {
    const res = await request(server.app).get(
      `/channels/62b7d1de1fcc8590ca75cbf2`
    );

    expect(res.statusCode).toBe(404);
    expect(res.body.data).toMatch(/Invalid channel/i);
  });

  it('should create a channel', async () => {
    const data = {
      userId: user._id,
      workSpaceId: workspace._id,
      name: 'channel test',
    };
    const res = await request(server.app).post('/channels').send(data);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/Channel created/i);
  });

  it('should not create a channel because user is invalid', async () => {
    const data = {
      userId: '62b7d1de1fcc8590ca75cbf2',
      workSpaceId: workspace._id,
      name: 'channel test',
    };
    const res = await request(server.app).post('/channels').send(data);

    expect(res.statusCode).toBe(404);
    expect(res.body.MsgError).toMatch(/Invalid user/i);
  });

  it('should not create a channel because workspace is invalid', async () => {
    const data = {
      userId: user._id,
      workSpaceId: '62b7d1de1fcc8590ca75cbf2',
      name: 'channel test',
    };
    const res = await request(server.app).post('/channels').send(data);

    expect(res.statusCode).toBe(404);
    expect(res.body.MsgError).toMatch(/Invalid workspace/i);
  });

  it('should add user to channel', async () => {
    const data = {
      userId: user._id,
      channelId: channel._id,
    };
    const res = await request(server.app).put('/channels').send(data);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/Channel updated/i);
  });

  it('should not add user to channel because user is invalid', async () => {
    const data = {
      userId: '62b7d1de1fcc8590ca75cbf2',
      channelId: channel._id,
    };
    const res = await request(server.app).put('/channels').send(data);

    expect(res.statusCode).toBe(404);
    expect(res.body.data).toMatch(/Invalid user/i);
  });

  it('should add user to channel', async () => {
    const data = {
      userId: user._id,
      channelId: '62b7d1de1fcc8590ca75cbf2',
    };
    const res = await request(server.app).put('/channels').send(data);

    expect(res.statusCode).toBe(404);
    expect(res.body.data).toMatch(/Invalid Channel/i);
  });

  it('should update the channel', async () => {
    const data = {
      userId: user._id,
      workSpaceId: workspace._id,
      name: 'channel test',
    };
    const res = await request(server.app).put(`/channels/${channel._id}`).send(data);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/Channel updated/i);
  });

  it('should not update the channel because its id is invalid', async () => {
    const data = {
      userId: user._id,
      workSpaceId: workspace._id,
      name: 'channel test',
    };
    const res = await request(server.app).put('/channels/62b7d1de1fcc8590ca75cbf2').send(data);

    expect(res.statusCode).toBe(404);
    expect(res.body.data).toMatch(/Invalid Channel/i);
  });

  it('should delete the channel', async () => {
    const res = await request(server.app).delete(`/channels/${channel._id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/Channel deleted/i);
  });

  it('should not delete the channel because its id is invalid', async () => {
    const res = await request(server.app).delete('/channels/62b7d1de1fcc8590ca75cbf2');

    expect(res.statusCode).toBe(404);
    expect(res.body.data).toMatch(/Invalid channel/i);
  });
});
