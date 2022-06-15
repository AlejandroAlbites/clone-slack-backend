const router = require('express').Router();
const {
  listUser,
  showUser,
  registerUser,
  loginUser,
  tokenRevalidate,
  updateUser,
  destroyUser,
  changePassword,
} = require('../controllers/user.controller');
const { validateJWT } = require('../middlewares/validate-jwt');

router.get('/', listUser);
router.get('/user', validateJWT, showUser);
router.post('/register', registerUser);
router.post('/login', loginUser);

router.get('/renew', validateJWT, tokenRevalidate);

// router.put('/:userId', updateUser);
router.put('/edit', validateJWT, updateUser);
router.put('/change-password', validateJWT, changePassword);
router.delete('/:userId', destroyUser);

module.exports = router;
