const mongoose = require('mongoose');

function connect() {
  mongoose.connect(process.env.MONGODB_SLACK_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  mongoose.connection.once('open', () => {
    console.log('Connection with mongoDB started');
  });

  mongoose.connection.on('error', (err) => {
    console.log('Something went wrong!', err);
  });

  return mongoose.connection;
}

module.exports = { connect };
