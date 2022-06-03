const Channel = require('../models/channel.model');
const User = require('../models/user.model');

// module.exports = {
const list = async (req, res) => {
  try {
    const channels = await Channel.find();

    res
      .status(200)
      .json({ ok: true, message: 'Channels found', data: channels });
  } catch (err) {
    res
      .status(404)
      .json({ ok: false, message: 'Channels not found', data: err });
  }
};

// GET ID - READ id

const show = async (req, res) => {
  try {
    const { channelId } = req.params;
    const channel = await Channel.findById(channelId);

    res.status(200).json({ ok: true, message: 'Channel found', data: channel });
  } catch (err) {
    res
      .status(404)
      .json({ ok: false, message: 'Channel not found', data: err });
  }
};

// CREATE - POST

const create = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('Invalid user');
    }
    const channel = await Channel.create({ ...req.body, users: userId });

    user.channels.push(channel);
    await user.save({ validateBeforeSave: false });
    res
      .status(200)
      .json({ ok: true, message: 'Channel created', data: channel });
  } catch (err) {
    console.log(err);
    res.status(404).json({ ok: false, message: 'channel could not be create' });
  }
};

// PUT - EDIT - UPDATE - USER-CHANNEL

const update = async (req, res) => {
  try {
    const { channelId, userId } = req.body;

    const channel = await Channel.findById(channelId);
    if (!channel) {
      throw new Error('Invalid Channel');
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new Error('Invalid user');
    }

    const newChannel = await Channel.findByIdAndUpdate(
      channelId,
      {
        ...req.body,
        users: channel.users.concat(userId),
      },
      { new: true }
    );

    await User.findByIdAndUpdate(
      userId,
      {
        ...req.body,
        channels: user.channels.concat(channelId),
      },
      { new: true }
    );

    res
      .status(200)
      .json({ ok: true, message: 'Channel updated', data: newChannel });
  } catch (err) {
    console.log(err);
    res
      .status(404)
      .json({ ok: false, message: 'Channel could not be updated', data: err });
  }
};

// PUT - EDIT - UPDATE

const updateChannel = async (req, res) => {
  try {
    const { channelId } = req.params;

    const channel = await Channel.findByIdAndUpdate(channelId, req.body, {
      new: true,
    });

    res
      .status(200)
      .json({ ok: true, message: 'Channel updated', data: channel });
  } catch (err) {
    console.log(err);
    res
      .status(404)
      .json({ ok: false, message: 'Channel could not be updated', data: err });
  }
};

// DELETE DESTROY

const destroy = async (req, res) => {
  try {
    const { channelId } = req.params;
    const channel = await Channel.findByIdAndDelete(channelId);

    res
      .status(200)
      .json({ ok: true, message: 'Channel deleted', data: channel });
  } catch (err) {
    res
      .status(404)
      .json({ ok: false, message: 'Channel could not be deleted', data: err });
  }
};

module.exports = {
  list,
  show,
  create,
  update,
  destroy,
  updateChannel,
};
