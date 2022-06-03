const router = require('express').Router();
const {
  listUser,
  showUser,
  registerUser,
  loginUser,
  tokenRevalidate,
  updateUser,
  destroyUser,
} = require('../controllers/user.controller');
const { validateJWT } = require('../middlewares/validate-jwt');

router.get('/', listUser);
router.get('/:userId', showUser);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/renew', validateJWT, tokenRevalidate);
router.put('/:userId', updateUser);
router.delete('/:userId', destroyUser);

module.exports = router;
