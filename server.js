const express = require('express');
const cors = require('cors');
const { connect } = require('./src/db');
require('dotenv').config();
const userRouter = require('./src/routes/user');
const channelRouter = require('./src/routes/channel');
const workSpaceRouter = require('./src/routes/workSpace');

const port = process.env.PORT || 8000;
const app = express();
connect();

app.use(express.json());
app.use(cors());

//Rutas - endpoint
app.use('/users', userRouter);
app.use('/channels', channelRouter);
app.use('/workSpace', workSpaceRouter);

app.listen(port, () => {
  console.log(`server started in http://localhost:${port}`);
});
