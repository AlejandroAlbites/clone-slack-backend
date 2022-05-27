const { Schema, model } = require('mongoose');

const threadSchema = new Schema(
  {
    message: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Thread = model('Thread', threadSchema);

module.exports = Thread;
