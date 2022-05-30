const Channel = require('../models/channel.model');

module.exports = {
  list(req, res) {
    Channel.find()
      .then((channels) => {
        res.status(200).json({ message: 'Channels found', data: channels });
      })
      .catch((err) => {
        res.status(404).json({ message: 'Channels not found', data: err });
      });
  },

  // GET ID - READ id

  show(req, res) {
    const { channelId } = req.params;

    User.findById(channelId)
      .then((channel) => {
        res.status(200).json({ message: 'channel found', data: channel });
      })
      .catch((err) => {
        res.status(404).json({ message: 'channel not found', data: err });
      });
  },

  create(req, res) {
    const data = req.body;

    const newChannel = {
      ...data,
    };

    Channel.create(newChannel)
      .then((channel) => {
        res.status(200).json({ message: 'Channel created', data: channel });
      })
      .catch((err) => {
        res
          .status(404)
          .json({ message: 'Channel coult not be create', data: err });
      });
  },

  // PUT - EDIT - UPDATE

  update(req, res) {
    const { channelId } = req.params;

    User.findByIdAndUpdate(channelId, req.body, { new: true })
      .then((channel) => {
        res.status(200).json({ message: 'channel updated', data: channel });
      })
      .catch((err) => {
        res
          .status(404)
          .json({ message: 'channel coult not be update', data: err });
      });
  },

  // DELETE DESTROY

  destroy(req, res) {
    const { channelId } = req.params;

    User.findByIdAndDelete(channelId)
      .then((channel) => {
        res.status(200).json({ message: 'channel deleted', data: channel });
      })
      .catch((err) => {
        res
          .status(404)
          .json({ message: 'channel coult not be detele', data: err });
      });
  },
};
