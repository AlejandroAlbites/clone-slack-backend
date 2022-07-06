require("dotenv").config({ path: "./.env" });
const Server = require('./src/models/server');

const server = new Server();

server.execute();
server.server.listen(server.port, () => {
  console.log(`server started in http://localhost:${server.port}`);
});
