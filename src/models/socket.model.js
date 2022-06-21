const { checkJWT } = require('../helpers/jwt');
const {
  userConnected,
  userDisconnected,
  emitAllUsers,
  saveMessage,
  getAllMessagesChannel,
  saveThreadMessage,
  getAllThreadMessages,
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

      socket.on('join-channel', (room) => {
        room.forEach((item) => socket.join(item));
      });
      socket.on('join-thread-message', (room) => {
        room.forEach((item) => socket.join(item));
      });

      socket.on('sendMessageUser', async (data) => {
        const message = await saveMessage(data);
        this.io.to(data.to).emit('sendMessageUser', message);
        this.io.to(data.from).emit('sendMessageUser', message);
      });

      socket.on('emitAllUsers', async () => {
        this.io.emit('emitAllUsers', await emitAllUsers());
      });

      socket.on('sendMessageChannel', async (data) => {
        // socket.join(data.to);
        const message = await saveMessage(data);
        this.io.to(data.to).emit('sendMessageChannel', message);
      });

      socket.on('getMessagesChannel', async (room) => {
        socket.join(room);
        const roomMessages = await getAllMessagesChannel(room);
        socket.emit('getMessagesChannel', roomMessages);
      });

      // HILOS DE MENSAJES THREAD

      socket.on('sendMessageThread', async (data) => {
        const threadMessage = await saveThreadMessage(data);
        this.io.to(data.to).emit('sendMessageThread', threadMessage);
      });

      //getThreadMessages
      socket.on('getThreadMessages', async (room) => {
        socket.join(room);
        const roomThreadMessages = await getAllThreadMessages(room);
        socket.emit('getThreadMessages', roomThreadMessages);
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
