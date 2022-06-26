const express = require('express');
const { connect } = require('../db');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const Socket = require('./socket.model');
const { transporter, verify } = require('../utils/mailer');
require('dotenv').config();

const userRouter = require('../routes/user');
const channelRouter = require('../routes/channel');
const workSpaceRouter = require('../routes/workSpace');
const messageRouter = require('../routes/message');

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    connect();
    verify(transporter);
    this.server = http.createServer(this.app);
    this.io = socketIo(this.server, {});
  }

  middleware() {
    this.app.use(cors());
    this.app.use(express.json());

    // End Points
    this.app.use('/users', userRouter);
    this.app.use('/channels', channelRouter);
    this.app.use('/workSpace', workSpaceRouter);
    this.app.use('/messages', messageRouter);
  }

  configSocket() {
    new Socket(this.io);
  }

  execute() {
    this.middleware();
    this.configSocket();

    // this.server.listen(this.port, () => {
    //   console.log(`server started in http://localhost:${this.port}`);
    // });
  }
}

module.exports = Server;
