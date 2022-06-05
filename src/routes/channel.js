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

module.exports = router;
