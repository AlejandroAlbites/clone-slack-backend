const Message = require('../models/message.model');

const getChatMessage = async (req, res) => {
  const miId = req.uid;
  const mensajesTo = req.params.from;

  const last30 = await Message.find({
    $or: [
      { from: miId, to: mensajesTo },
      { from: mensajesTo, to: miId },
    ],
  })
    .sort({ createdAt: 'asc' })
    .limit(30);

  res.json({
    ok: true,
    msg: last30,
  });
};

module.exports = {
  getChatMessage,
};
