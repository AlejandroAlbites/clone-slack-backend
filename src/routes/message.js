const router = require('express').Router();
const {
  getChatMessage,
  countLikes,
} = require('../controllers/message.controller');

const { validateJWT } = require('../middlewares/validate-jwt');

router.get('/:from', validateJWT, getChatMessage);
router.post('/:from/like', validateJWT, countLikes);
module.exports = router;
