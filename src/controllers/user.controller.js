const { disabled } = require('express/lib/application');
const User = require('../models/user.model');

// module.exports = {
//list - GET - Read

const listUser = async(req, res) => {

  try {
    const users = await User.find()
    res.status(200).json({
      ok: true, 
      message: 'Users found',
      data: users
    })
  } catch (err) {
    res.status(404).json({
      ok: false,
      message: 'Users not found', 
      data: err 
    });
  }

};

// GET ID - READ id

const showUser = async(req, res) => {

  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    res.status(200).json({
      ok: true, 
      message: 'User found', 
      data: user
    })

  } catch (err) {
    res.status(404).json({ 
      ok: false,
      message: 'User not found', 
      data: err 
    });
  }

};

// POST - CREATE

const createUser = async(req, res) => {
  const data = req.body;

  const newUser = {
    ...data,
  };

  try {
    const user = await User.create(newUser);
    res.status(200).json({
      ok: true, 
      message: 'User created',
      data: user
    })


  } catch (err) {
    res.status(404).json({ 
      ok: false,
      message: 'User coult not be create', 
      data: err 
    });
  }

};

// PUT - EDIT - UPDATE

const updateUser = async(req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findByIdAndUpdate(userId, req.body, {
      new: true,
      runValidators: true,
      context: 'query',
    });

    res.status(200).json({ 
      ok: true,
      message: 'User updated', 
      data: user 
    });

  } catch (err) {
    res.status(404).json({ 
      ok: false,
      message: 'User could not be update', 
      data: err 
    });
  }

};

// DELETE DESTROY

const destroyUser = async(req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findByIdAndDelete(userId);

    res.status(200).json({ 
      ok: true,
      message: 'User deleted', 
      data: user 
    });

  } catch (err) {
    res.status(404).json({ 
      ok: false,
      message: 'User could not be detele', 
      data: err 
    });
  }

};

module.exports = {
  listUser,
  showUser,
  createUser,
  updateUser,
  destroyUser,
};
