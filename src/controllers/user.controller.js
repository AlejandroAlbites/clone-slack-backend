const { disabled } = require('express/lib/application');
const User = require('../models/user.model');

// module.exports = {
//list - GET - Read

const listUser = (req, res) => {
  User.find()
    .then((users) => {
      res.status(200).json({ message: 'Users found', data: users });
    })
    .catch((err) => {
      res.status(404).json({ message: 'Users not found', data: err });
    });
};

// GET ID - READ id

const showUser = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      res.status(200).json({ message: 'User found', data: user });
    })
    .catch((err) => {
      res.status(404).json({ message: 'User not found', data: err });
    });
};

// POST - CREATE

const createUser = (req, res) => {
  const data = req.body;

  const newUser = {
    ...data,
  };

  User.create(newUser)
    .then((user) => {
      res.status(200).json({ message: 'User created', data: user });
    })
    .catch((err) => {
      res.status(404).json({ message: 'User coult not be create', data: err });
    });
};

// PUT - EDIT - UPDATE

const updateUser = (req, res) => {
  const { userId } = req.params;

  User.findByIdAndUpdate(userId, req.body, {
    new: true,
    runValidators: true,
    context: 'query',
  })
    .then((user) => {
      res.status(200).json({ message: 'User updated', data: user });
    })
    .catch((err) => {
      res.status(404).json({ message: 'User coult not be update', data: err });
    });
};

// DELETE DESTROY

const destroyUser = (req, res) => {
  const { userId } = req.params;

  User.findByIdAndDelete(userId)
    .then((user) => {
      res.status(200).json({ message: 'User deleted', data: user });
    })
    .catch((err) => {
      res.status(404).json({ message: 'User coult not be detele', data: err });
    });
};
// };
module.exports = {
  listUser,
  showUser,
  createUser,
  updateUser,
  destroyUser,
};
