const Message = require('../models/message.model');
const User = require('../models/user.model');
const Thread = require('../models/thread.model');

const userConnected = async (uid) => {
  try {
    const user = await User.findByIdAndUpdate(
      uid,
      { state: 'enable' },
      { new: true }
    );
    if (!user) {
      throw new Error('User not found');
    }

    return user;
  } catch (error) {
    return error.message;
  }
};
const statusChanged = async (uid, req) => {
  try {
    const user = await User.findByIdAndUpdate(
      uid,
      { state: req },
      { new: true }
    );
    if (!user) {
      throw new Error('User not found');
    }

    return user;
  } catch (error) {
    return error.message;
  }
};
const userDisconnected = async (uid) => {
  try {
    const user = await User.findByIdAndUpdate(
      uid,
      { state: 'disable' },
      { new: true }
    );
    if (!user) {
      throw new Error('User not found');
    }

    return user;
  } catch (error) {
    return error.message;
  }
};

const emitAllUsers = async () => {
  try {
    const users = await User.find();

    return users;
  } catch (error) {
    console.log(error);
  }
};

const saveMessage = async (payload) => {
  try {
    const message = new Message(payload);
    await message.save();

    return message;
  } catch (error) {
    return false;
  }
};

const getAllMessagesChannel = async (room) => {
  try {
    const messages = await Message.find();

    const messageFilter = messages.filter((message) => message.to == room);

    return messageFilter;
  } catch (error) {
    console.log(error);
  }
};

const saveThreadMessage = async (data) => {
  const messageId = data.to;

  try {
    const message = await Message.findById(messageId);
    if (!message) {
      throw new Error('Invalid message');
    }

    const thread = new Thread(data);
    await thread.save();

    await Message.updateOne(
      { _id: messageId },
      {
        $push: { thread: thread },
      }
    );

    return thread;
  } catch (err) {
    return err.message
  }
};

const getAllThreadMessages = async (room) => {
  try {
    const message = await Message.findById(room);

    const threadMessages = message.thread;

    return threadMessages;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  userConnected,
  userDisconnected,
  emitAllUsers,
  saveMessage,
  getAllMessagesChannel,
  saveThreadMessage,
  getAllThreadMessages,
  statusChanged,
};
