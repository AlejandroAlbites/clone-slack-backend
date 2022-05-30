const router = require('express').Router();
const {
  list,
  show,
  create,
  update,
  destroy,
  //   updateAddUser,
} = require('../controllers/channel.controller');

router.get('/', list);
router.get('/:channelId', show);
router.post('/:userId', create);
router.put('/:channelId/:userId', update);
router.delete('/:channelId', destroy);
// router.put('/:userId', updateAddUser);

// router.route('/:channelId').get(channelController.show);
// router.route('/').post(channelController.create);
// router.route('/:channelId').put(channelController.update);
// router.route('/:channelId').delete(channelController.destroy);

module.exports = router;
