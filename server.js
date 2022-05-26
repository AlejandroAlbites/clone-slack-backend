const express = require("express");
const cors = require("cors");
const { connect } = require("./src/db");

const port = 8080;
const app = express();
connect();

app.use(express.json());
app.use(cors());

//Rutas - endpoint

app.listen(port, () => {
  console.log("App running OK");
});
