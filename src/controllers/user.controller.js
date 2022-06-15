const { disabled } = require('express/lib/application');
const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const WorkSpace = require('../models/workSpace.model');
const { JWTgenerator } = require('../helpers/jwt');
const { transporter, passwordChanged } = require('../utils/mailer');

// GET - READ

const listUser = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({
      ok: true,
      message: 'Users found',
      data: users,
    });
  } catch (err) {
    res.status(404).json({
      ok: false,
      message: 'Users not found',
      data: err,
    });
  }
};

// GET ID - READ id

const showUser = async (req, res) => {
  try {
    const { uid } = req;
    const user = await User.findById(uid).select('-password');
    res.status(200).json({
      ok: true,
      message: 'User found',
      data: user,
    });
  } catch (err) {
    res.status(404).json({
      ok: false,
      message: 'User not found',
      data: err,
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
    console.log(err);
    res.status(404).json({
      ok: false,
      message: 'User coult not be create',
      data: err,
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
      return res
        .status(400)
        .json({ ok: false, message: 'the email or password is not correct' });
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
      data: err,
    });
  }
};

const changePassword = async (req, res) => {
  const { uid } = req;
  try {
    const findUser = await User.findById(uid);
    const validatePassword = await bcrypt.compare(
      req.body.oldPassword,
      findUser.password
    );

    if (!validatePassword) {
      return res
        .status(400)
        .json({ ok: false, message: 'the password is not correct' });
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
      data: err,
    });
    console.log(err);
  }
};

// DESTROY DELETE

const destroyUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findByIdAndDelete(userId);

    res.status(200).json({
      ok: true,
      message: 'User deleted',
      data: user,
    });
  } catch (err) {
    res.status(404).json({
      ok: false,
      message: 'User could not be detele',
      data: err,
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
};
