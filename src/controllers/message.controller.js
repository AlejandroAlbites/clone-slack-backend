const Message = require('../models/message.model');
const User = require('../models/user.model');
const Like = require('../models/like.model');

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
    .limit(100)

  res.json({
    ok: true,
    msg: last30,
  });
};

const countLikes = async (req, res) => {
  const messageId = req.params.from;
  const { uid } = req;

  try {
    const message = await Message.findById(messageId);
    if (!message) {
      throw new Error('Invalid message');
    }

    const user = await User.findById(uid);
    if (!user) {
      throw new Error('Invalid user');
    }

    const LikeMessage = await Like.findOne({
      userId: user._id,
      messageId: message._id,
    });
    if (!LikeMessage) {
      const newLike = new Like({
        userId: user._id,
        messageId: message._id,
      });
      const likeData = await newLike.save();
      await Message.updateOne(
        { _id: message._id },
        {
          $push: { likes: likeData },
        }
      );

      const messageUpdated = await Message.findById(messageId);
      return res.status(200).json({
        ok: true,
        msg: 'Like successfully added',
        like: messageUpdated,
      });
    } else {
      await Like.deleteOne({ _id: LikeMessage._id });

      await Message.updateOne(
        { _id: LikeMessage.messageId },
        {
          $pull: {
            likes: LikeMessage,
          },
        }
      );
      const messageUpdated = await Message.findById(messageId);
      return res.status(200).json({
        ok: true,
        msg: 'Like successfully removed',
        like: messageUpdated,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  getChatMessage,
  countLikes,
};
