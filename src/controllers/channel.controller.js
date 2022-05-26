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
};
