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

  // Channel.find()
  //   .then((channels) => {
  //     res.status(200).json({ message: 'Channels found', data: channels });
  //   })
  //   .catch((err) => {
  //     res.status(404).json({ message: 'Channels not found', data: err });
  //   });
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

  // const { channelId } = req.params;

  // Channel.findById(channelId)
  //   .then((channel) => {
  //     res.status(200).json({ message: 'channel found', data: channel });
  //   })
  //   .catch((err) => {
  //     res.status(404).json({ message: 'channel not found', data: err });
  //   });
};

// CREATE - POST

const create = async (req, res) => {
  try {
    const { userId } = req.params;
    const channel = await Channel.create({ ...req.body, users: userId });
    const { _id } = channel;
    await User.findByIdAndUpdate(userId, {
      ...req.body,
      channels: _id,
    });
    // const user = await User.findById(userId);
    // user.channels.push(_id);
    // console.log(user);

    // console.log(_id);

    // await user.save();
    res
      .status(200)
      .json({ ok: true, message: 'Channel created', data: channel });
  } catch (err) {
    console.log(err);
    res.status(404).json({ ok: false, message: 'channel could not be create' });
  }

  // const data = req.body;
  // const newChannel = {
  //   ...data,
  // };
  // Channel.create(newChannel)
  //   .then((channel) => {
  //     res.status(200).json({ message: 'Channel created', data: channel });
  //   })
  //   .catch((err) => {
  //     res
  //       .status(404)
  //       .json({ message: 'Channel coult not be create', data: err });
  //   });
};

// PUT - EDIT - UPDATE

const update = async (req, res) => {
  try {
    const { channelId, userId } = req.params;
    console.log(userId);
    const channel = await Channel.findByIdAndUpdate(channelId, {
      ...req.body,
      users: userId,
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

  // Channel.findByIdAndUpdate(channelId, req.body, { new: true })
  //   .then((channel) => {
  //     res.status(200).json({ message: 'channel updated', data: channel });
  //   })
  //   .catch((err) => {
  //     res
  //       .status(404)
  //       .json({ message: 'channel coult not be ', data: err });
  //   });
};

// FIND CHANNEL AND JOIN

// const updateAddUser = (req, res) => {
//   const { userId } = req.params;
//   console.log(userId);
// try {
//   const  = req.body;
//   const channel = await Channel.findByIdAndUpdate(channelId, req.body, {
//     new: true,
//   });

//   res
//     .status(200)
//     .json({ ok: true, message: 'Channel updated', data: channel });
// } catch (err) {
//   res
//     .status(404)
//     .json({ ok: false, message: 'Channel could not be updated', data: err });
// }
// };

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
  // const { channelId } = req.params;

  // Channel.findByIdAndDelete(channelId)
  //   .then((channel) => {
  //     res.status(200).json({ message: 'channel deleted', data: channel });
  //   })
  //   .catch((err) => {
  //     res
  //       .status(404)
  //       .json({ message: 'channel coult not be detele', data: err });
  //   });
};
// };

module.exports = {
  list,
  show,
  create,
  update,
  destroy,
  // updateAddUser,
};
