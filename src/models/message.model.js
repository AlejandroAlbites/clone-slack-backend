const { Schema, model } = require('mongoose');

const messageSchema = new Schema(
  {
    message: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Message = model('Message', messageSchema);

module.exports = Message;
