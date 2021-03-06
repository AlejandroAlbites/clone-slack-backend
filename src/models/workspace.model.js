const { Schema, model } = require('mongoose');

const workSpaceSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "the workspace's name is required"],
      minlength: 4,
      maxlength: 12,
      unique: true,
      default: 'Make It Real',
    },
    users: {
      type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    },
    channels: {
      type: [Schema.Types.ObjectId],
      ref: 'Channels',
    }
  },
  {
    timestamps: true,
  }
);

const WorkSpace = model('WorkSpace', workSpaceSchema);

module.exports = WorkSpace;
