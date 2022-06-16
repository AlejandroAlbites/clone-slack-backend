const { Schema, model } = require('mongoose');

const channelSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "the channel's name is required"],
      minlength: 4,
      maxlength: 30,
    },
    description: {
      type: String,
      required: false,
    },
    users: {
      type: [Schema.Types.ObjectId],
      ref: 'User',
      required: [true, "the channel's user are required"],
    },
    premium: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Channel = model('Channel', channelSchema);

module.exports = Channel;
