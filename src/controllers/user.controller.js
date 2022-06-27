const { disabled } = require('express/lib/application');
const JWT = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const WorkSpace = require('../models/workspace.model');
const { JWTgenerator } = require('../helpers/jwt');
const { transporter, passwordChanged, forgoted } = require('../utils/mailer');

// GET - READ

const listUser = async (req, res) => {
  try {
    const users = await User.find();
    if (!users) {
      throw new Error('User not found');
    }
    res.status(200).json({
      ok: true,
      message: 'Users found',
      data: users,
    });
  } catch (err) {
    res.status(404).json({
      ok: false,
      message: 'Users not found',
      data: err.message,
    });
  }
};

// GET ID - READ id

const showUser = async (req, res) => {
  try {
    const { uid } = req;
    const user = await User.findById(uid).select('-password');
    if (!user) {
      throw new Error('User not found');
    }
    res.status(200).json({
      ok: true,
      message: 'User found',
      data: user,
    });
  } catch (err) {
    res.status(404).json({
      ok: false,
      message: 'User not found',
      data: err.message,
    });
  }
};

// POST - CREATE - REGISTER

const registerUser = async (req, res) => {
  try {
    const { workSpaceId, password } = req.body;

    // Requiriendo el Id del workSpace para luego poder agregar el usuario creado mediante un push
    const workSpace = await WorkSpace.findById(workSpaceId);
    if (!workSpace) {
      throw new Error('Invalid workspace');
    }
    //Encrypta la contraseña
    const encryptPassword = await bcrypt.hash(password, 8);

    // Crea el usuario
    const user = await User.create({ ...req.body, password: encryptPassword });

    // Agrega el usuario al array de users del workspace y lo guarda
    workSpace.users.push(user);
    await workSpace.save({ validateBeforeSave: false });

    // Generar el JWT
    const token = await JWTgenerator(user._id, user.fullName, user.email);

    res.status(200).json({
      ok: true,
      message: 'User created',
      token,
      data: user,
    });
  } catch (err) {
    res.status(404).json({
      ok: false,
      message: 'User coult not be create',
      data: err.message,
    });
  }
};

// POST LOGIN

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validacion si el usuario existe en la base de datos
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ ok: false, message: 'the email or password is not correct' });
    }

    // Validar que el password sea correcto
    const validatePassword = await bcrypt.compare(password, user.password);
    if (!validatePassword) {
      throw new Error('the email or password is not correct');
    }

    // Generar el JWT
    const token = await JWTgenerator(user._id, user.fullName, user.email);

    // Respuesta exitosa
    res.status(200).json({
      ok: true,
      message: 'Login successful',
      name: user.fullName,
      id: user._id,
      image: user.image,
      description: user.description,
      token,
    });
  } catch (err) {
    res.status(500).json({
      ok: false,
      message:
        'There was a problem trying to login, please contact the administrator',
      data: err.message,
    });
  }
};

// GET - REVALIDAR EL TOKEN

const tokenRevalidate = async (req, res) => {
  const { uid, fullName, email } = req;

  // Generar el JWT

  const token = await JWTgenerator(uid, fullName, email);
  res.status(200).json({
    ok: true,
    message: 'token revalidated',
    token,
    uid,
    fullName,
    email,
  });
};

// PUT - EDIT - UPDATE

const updateUser = async (req, res) => {
  const { uid } = req;
  try {
    delete req.body.email;
    const user = await User.findByIdAndUpdate(uid, req.body, {
      new: true,
      runValidators: true,
      context: 'query',
    });
    res.status(200).json({
      ok: true,
      message: 'User updated',
      data: user,
    });
  } catch (err) {
    res.status(500).json({
      ok: false,
      message: 'User could not be update',
      data: err.message,
    });
  }
};

const changePassword = async (req, res) => {
  const { uid } = req;
  try {
    const findUser = await User.findById(uid);
    if (!findUser) {
      throw new Error('User not found');
    }
    const validatePassword = await bcrypt.compare(
      req.body.oldPassword,
      findUser.password
    );

    if (!validatePassword) {
      throw new Error('Password is incorrect');
    }

    const encryptPassword = await bcrypt.hash(req.body.repeatPassword, 8);

    findUser.password = encryptPassword;
    await findUser.save({ validateBeforeSave: false });

    await transporter.sendMail(passwordChanged(findUser));

    res.status(200).json({
      ok: true,
      message: 'User updated',
      data: findUser,
      password: encryptPassword,
    });
  } catch (err) {
    res.status(500).json({
      ok: false,
      message: 'User could not be update',
      data: err.message,
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error('User not found');
    }

    const token = await JWTgenerator(user._id, user.fullName, user.email);

    await transporter.sendMail(forgoted(user, token));

    res.status(200).json({
      ok: true,
      message: 'Email sent',
      token,
    });
  } catch (err) {
    res.status(500).json({
      ok: false,
      message: 'Email could not be sent',
      data: err.message,
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const decoded = await JWT.verify(token, process.env.SECRET_JWT_SEED_SLACK);

    const user = await User.findById(decoded.uid);
    if (!user) {
      throw new Error('User not found');
    }
    const encryptPassword = await bcrypt.hash(newPassword, 8);

    user.password = encryptPassword;
    await user.save({ validateBeforeSave: false });

    await transporter.sendMail(passwordChanged(user));

    res.status(200).json({
      ok: true,
      message: 'Password updated',
      data: user,
    });
  } catch (err) {
    res.status(500).json({
      ok: false,
      message: 'Password could not be updated',
      data: err.message,
    });
  }
};

const changePremium = async (req, res) => {
  try {
    const { uid } = req;
    const findUser = await User.findById(uid);
    if (!findUser) {
      throw new Error('User not found');
    }
    findUser.premium = true;
    await findUser.save({ validateBeforeSave: false });

    res.status(200).json({
      ok: true,
      message: 'User updated',
      data: findUser,
      premium: true,
    });
  } catch (err) {
    res.status(500).json({
      ok: false,
      message: 'User could not be update',
      data: err.message,
    });
  }
};

// DESTROY DELETE

const destroyUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      throw new Error('User not found');
    }

    res.status(200).json({
      ok: true,
      message: 'User deleted',
      data: user,
    });
  } catch (err) {
    res.status(404).json({
      ok: false,
      message: 'User could not be detele',
      data: err.message,
    });
  }
};

module.exports = {
  listUser,
  showUser,
  registerUser,
  loginUser,
  tokenRevalidate,
  updateUser,
  destroyUser,
  changePassword,
  forgotPassword,
  resetPassword,
  changePremium,
};
