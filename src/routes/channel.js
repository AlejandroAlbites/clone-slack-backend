const router = require('express').Router();
const {
  list,
  show,
  create,
  update,
  destroy,
  updateChannel,
} = require('../controllers/channel.controller');

router.get('/', list);
router.get('/:channelId', show);
router.post('/', create);
router.put('/', update);
router.delete('/:channelId', destroy);
router.put('/:channelId', updateChannel);

// router.route('/:channelId').get(channelController.show);
// router.route('/').post(channelController.create);
// router.route('/:channelId').put(channelController.update);
// router.route('/:channelId').delete(channelController.destroy);

module.exports = router;
