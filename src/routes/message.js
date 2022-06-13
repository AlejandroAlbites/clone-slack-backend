const router = require('express').Router();
const { getChatMessage, getChatMessageGroup } = require('../controllers/message.controller');
const { validateJWT } = require('../middlewares/validate-jwt');

router.get('/:from', validateJWT, getChatMessage);

module.exports = router;
