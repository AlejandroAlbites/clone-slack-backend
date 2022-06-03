const router = require('express').Router();
const {
  listWorkSpace,
  createWorkSpace,
} = require('../controllers/workSpace.controller');

router.get('/', listWorkSpace);
router.post('/', createWorkSpace);

module.exports = router;
