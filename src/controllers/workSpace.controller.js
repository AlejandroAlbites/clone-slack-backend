const WorkSpace = require('../models/workSpace.model');

const listWorkSpace = async (req, res) => {
  try {
    const workSpace = await WorkSpace.find();

    res
      .status(200)
      .json({ ok: true, message: 'Work Space found', data: workSpace });
  } catch (err) {
    res
      .status(404)
      .json({ ok: false, message: 'Work Space not found', data: err });
  }
};

const createWorkSpace = async (req, res) => {
  try {
    const workSpace = new WorkSpace(req.body);
    await workSpace.save();

    res.status(201).json({ ok: true, msg: 'WorkSpace Make It Real created' });
  } catch (err) {
    res
      .status(500)
      .json({ ok: false, msg: 'Error, workSpace could not be create' });
  }
};

module.exports = {
  listWorkSpace,
  createWorkSpace,
};
