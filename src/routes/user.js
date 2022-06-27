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
  forgotPassword,
  resetPassword,
  changePremium,
} = require('../controllers/user.controller');
const { validateJWT } = require('../middlewares/validate-jwt');

router.get('/', listUser);
router.get('/user', validateJWT, showUser);
router.post('/register', registerUser);
router.post('/login', loginUser);

router.get('/renew', validateJWT, tokenRevalidate);

router.put('/edit', validateJWT, updateUser);
router.put('/premium', validateJWT, changePremium);
router.put('/change-password', validateJWT, changePassword);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password', resetPassword);
router.delete('/:userId', destroyUser);

module.exports = router;
