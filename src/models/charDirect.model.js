const { Schema, model } = require('mongoose');

const chatDirectSchema = new Schema(
  {},
  {
    timestamps: true,
  }
);

const ChartDirect = model('ChartDirect', chatDirectSchema);

module.exports = ChartDirect;
