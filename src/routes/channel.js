const router = require('express').Router();
const channelController = require('../controllers/channel.controller');

router.route('/').get(channelController.list);
router.route('/:channelId').get(channelController.show);
router.route('/').post(channelController.create);
router.route('/:channelId').put(channelController.update);
router.route('/:channelId').delete(channelController.destroy);

module.exports = router;
