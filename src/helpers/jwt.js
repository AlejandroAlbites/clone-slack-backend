const jwt = require('jsonwebtoken');

const JWTgenerator = (uid, fullName, email) => {
  return new Promise((resolve, reject) => {
    const payload = { uid, fullName, email };

    jwt.sign(
      payload,
      process.env.SECRET_JWT_SEED_SLACK,
      {
        expiresIn: '24h',
      },
      (err, token) => {
        if (err) {
          reject('could not generate token');
        }
        resolve(token);
      }
    );
  });
};

const checkJWT = (token = '') => {
  try {
    const { uid, fullName, email } = jwt.verify(
      token,
      process.env.SECRET_JWT_SEED_SLACK
    );
    return [true, uid];
  } catch (error) {
    return [false, null];
  }
};

module.exports = {
  JWTgenerator,
  checkJWT,
};
