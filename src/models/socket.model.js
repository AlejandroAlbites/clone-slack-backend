const { checkJWT } = require('../helpers/jwt');
const {
  userConnected,
  userDisconnected,
  emitAllUsers,
} = require('../controllers/socket.controller');
class Socket {
  constructor(io) {
    this.io = io;
    this.socketEvent();
  }

  socketEvent() {
    this.io.on('connection', async (socket) => {
      console.log('client connect');

      const [check, uid] = checkJWT(socket.handshake.query['x-token']);
      if (!check) {
        console.log('client not valid');
        return socket.disconnect();
      }

      await userConnected(uid);

      this.io.emit('emitAllUsers', await emitAllUsers());

      socket.on('disconnect', async () => {
        console.log('client disconnected');
        await userDisconnected(uid);
      });
    });
  }
}

module.exports = Socket;
