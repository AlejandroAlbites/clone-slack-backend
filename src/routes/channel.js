const router = require('express').Router();
const channelController = require('../controllers/channel.controller');

router.route('/').get(channelController.list);
router.route('/').post(channelController.create);

module.exports = router;
