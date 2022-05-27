const express = require('express');
const cors = require('cors');
const { connect } = require('./src/db');
const userRouter = require('./src/routes/user');
const channelRouter = require('./src/routes/channel');

const port = 8080;
const app = express();
connect();

app.use(express.json());
app.use(cors());

//Rutas - endpoint
app.use('/users', userRouter);
app.use('/channels', channelRouter);

app.listen(port, () => {
  console.log(`server started in http://localhost:${port}`);
});
