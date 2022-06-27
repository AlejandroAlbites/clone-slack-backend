const WorkSpace = require('../models/workspace.model');
const User = require('../models/user.model');

const listWorkSpace = async (req, res) => {
  try {
    const { uid } = req;

    const user = await User.findById(uid);

    if (!user) {
      throw new Error('User not found');
    }

    const workSpace = await WorkSpace.find();

    res
      .status(200)
      .json({ ok: true, message: 'Work Space found', data: workSpace });
  } catch (err) {
    res
      .status(404)
      .json({ ok: false, message: 'Work Space not found', data: err.message });
  }
};

const createWorkSpace = async (req, res) => {
  try {
    const { uid } = req;
    const user = await User.findById(uid);

    if (!user) {
      throw new Error('User not found');
    }

    const workspace = await WorkSpace.create({ ...req.body, users: user._id });

    user.workSpaceId.push(workspace);
    await user.save({ validateBeforeSave: false });

    res.status(200).json({ ok: true, msg: 'WorkSpace created', workspace });
  } catch (err) {
    res
      .status(500)
      .json({
        ok: false,
        msg: 'Error, workSpace could not be create',
        msgError: err.message,
      });
  }
};

const addUser = async (req, res) => {
  try {
    const { uid } = req;
    const { workspaceId } = req.body;

    const workspace = await WorkSpace.findById(workspaceId);
    if (!workspace) {
      throw new Error('Invalid workspace');
    }

    const user = await User.findById(uid);
    if (!user) {
      throw new Error('Invalid user');
    }

    const updateWorkSpace = await WorkSpace.findByIdAndUpdate(
      workspaceId,
      {
        ...req.body,
        users: workspace.users.concat(user._id),
      },
      { new: true }
    );

    await User.findByIdAndUpdate(
      user._id,
      {
        ...req.body,
        workSpaceId: user.workSpaceId.concat(workspaceId),
      },
      { new: true }
    );

    res.status(200).json({
      ok: true,
      message: 'WorkSpace updated',
      workspaceId: workspaceId,
      userId: user._id,
      data: updateWorkSpace,
    });
  } catch (err) {
    res
      .status(404)
      .json({
        ok: false,
        message: 'WorkSpace could not be updated',
        data: err.message,
      });
  }
};

module.exports = {
  listWorkSpace,
  createWorkSpace,
  addUser,
};
