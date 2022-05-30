const { Schema, model, models } = require('mongoose');

const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
const passwordRegex =
  /(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      minlength: 6,
      maxlength: 40,
    },
    email: {
      type: String,
      required: true,
      match: [emailRegex, 'Invalid email'],
      validate: [
        {
          validator(value) {
            return models.User.findOne({ email: value })
              .then((user) => !user)
              .catch(() => error);
          },
          message: 'There is already a user with that email',
        },
      ],
    },
    password: {
      type: String,
      required: true,
      match: [passwordRegex, 'Incorrect password'],
    },
    description: {
      type: String,
      maxlength: 150,
      default: 'Cuentanos algo sobre ti',
    },
    image: {
      type: String,
      default:
        'https://ceslava.s3-accelerate.amazonaws.com/2016/04/mistery-man-gravatar-wordpress-avatar-persona-misteriosa.png',
    },
    channels: {
      type: [{ type: Schema.Types.ObjectId, ref: 'Channel' }],
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const User = model('User', userSchema);

module.exports = User;
