const { Schema, model } = require('mongoose');

const channelSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "the channel's name is required"],
      minlength: 4,
      maxlength: 20,
    },
  },
  {
    timestamps: true,
  }
);

const Channel = model('Channel', channelSchema);

module.exports = Channel;
