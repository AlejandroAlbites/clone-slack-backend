const router = require('express').Router();
const {
  listWorkSpace,
  createWorkSpace,
  addUser,
} = require('../controllers/workSpace.controller');
const { validateJWT } = require('../middlewares/validate-jwt');

router.get('/',validateJWT, listWorkSpace);
router.post('/',validateJWT, createWorkSpace);
router.put('/',validateJWT, addUser);

module.exports = router;
