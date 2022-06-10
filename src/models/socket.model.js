const { checkJWT } = require('../helpers/jwt');
const {
  userConnected,
  userDisconnected,
  emitAllUsers,
  saveMessage,
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

      socket.join(uid);

      this.io.emit('emitAllUsers', await emitAllUsers());

      socket.on('sendMessage', async (data) => {
        const message = await saveMessage(data);
        this.io.to(data.to).emit("sendMessage", message);
        this.io.to(data.from).emit("sendMessage", message);
      });

      socket.on('emitAllUsers', async () => {
        this.io.emit('emitAllUsers', await emitAllUsers());
      });

      socket.on('disconnect', async () => {
        console.log('client disconnected', uid);
        await userDisconnected(uid);
        this.io.emit('emitAllUsers', await emitAllUsers());
      });
    });
  }
}

module.exports = Socket;
