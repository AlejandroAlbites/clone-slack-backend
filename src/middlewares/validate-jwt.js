const jwt = require('jsonwebtoken');

const validateJWT = (req, res, next) => {
  const token = req.header('x-token');

  if (!token) {
    return res.status(401).json({
      ok: false,
      message: 'there is no token in the request',
    });
  }
  try {
    const { uid, fullName, email } = jwt.verify(
      token,
      process.env.SECRET_JWT_SEED_SLACK
    );

    req.uid = uid;
    req.fullName = fullName;
    req.email = email;
  } catch (err) {
    return res.status(401).json({
      ok: false,
      message: ' invalid token',
    });
  }
  next();
};

module.exports = {
  validateJWT,
};
