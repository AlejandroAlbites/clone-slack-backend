const User = require('../models/user.model');

const userConnected = async (uid) => {
  try {
    const user = await User.findByIdAndUpdate(
      uid,
      { state: 'enable' },
      { new: true }
    );

    return user;
  } catch (error) {
    console.log(error);
  }
};
const userDisconnected = async (uid) => {
  try {
    const user = await User.findByIdAndUpdate(
      uid,
      { state: 'disable' },
      { new: true }
    );

    return user;
  } catch (error) {
    console.log(error);
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

module.exports = {
  userConnected,
  userDisconnected,
  emitAllUsers,
};
