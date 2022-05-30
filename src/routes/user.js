const router = require('express').Router();
const {
  listUser,
  showUser,
  createUser,
  updateUser,
  destroyUser,
} = require('../controllers/user.controller');

router.get('/', listUser);
router.get('/:userId', showUser);
router.post('/', createUser);
router.put('/:userId', updateUser);
router.delete('/:userId', destroyUser);
// router.route('/:userId').get(userController.show);
// router.route('/').post(userController.create);
// router.route('/:userId').put(userController.update);
// router.route('/:userId').delete(userController.destroy);

module.exports = router;
