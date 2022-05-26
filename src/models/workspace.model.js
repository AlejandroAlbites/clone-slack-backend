const { Schema, model } = require('mongoose');

const workSpaceSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "the workspace's name is required"],
      minlength: 4,
      maxlength: 12,
    },
  },
  {
    timestamps: true,
  }
);

const WorkSpace = model('WorkSpace', workSpaceSchema);

module.exports = WorkSpace;
