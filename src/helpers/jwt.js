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
          console.log(err);
          reject('could not generate token');
        }
        resolve(token);
      }
    );
  });
};

module.exports = {
  JWTgenerator,
};
