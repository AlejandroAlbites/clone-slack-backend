const mongoose = require('mongoose');

let connection;

async function connect() {
  if (connection) return;

  const uri =
    process.env.MONGODB_SLACK_URL

  connection = mongoose.connection;

  connection.once('open', () =>
    console.log('Connection established successfully')
  );
  connection.on('disconnected', () => console.log('Succesfully disconnected'));
  connection.on('error', (err) => console.log('Something went wrong', err));

  await mongoose.connect(uri);
}

async function disconnected() {
  if (!connection) return;

  await mongoose.disconnect();
}

async function cleanup() {
  if (!connection) return;
  for (const collection in connection.collections) {
    await connection.collections[collection].deleteMany({});
  }
}

module.exports = { connect, disconnected, cleanup };
