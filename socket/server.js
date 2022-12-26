'use strict';

import { createServer } from "http";
import { join, dirname } from "path";
import { fileURLToPath } from 'url';
import { createReadStream } from "fs";
import { Server } from "socket.io";


const port = 3000;
const __dirname = dirname(fileURLToPath(import.meta.url));// без этого __dirname не работает в ESM
let online = 0;

const getRandomColor = () => {
  const symbols = "0123456789abcdef";
  let randomColor = "";
  for (let i = 0; i < 6; i++) {
    randomColor += symbols.charAt(Math.floor(Math.random() * symbols.length));
  }
  return randomColor;
};

const getClientName = name => {
  return {
    name,
    color: `#${getRandomColor()}`
  }
};

const server = createServer((req, res) => {
  const filePath = join(__dirname, "index.html");
  let readStream = createReadStream(filePath);
  readStream.pipe(res);
});

const io = new Server(server);

io.on("connection", client => {

  let user = {};
  online++;

  client.on('client_name', (data) => {

    data ? user = getClientName(data) : user = getClientName(client.id.substr(0, 10).toUpperCase());

    let payload = {
      message: `User ${user.name} has connected`,
      online: online,
    };

    console.log(payload.message);
    client.broadcast.emit('client_connected', payload);
    return user;
  });


  client.on('client_message', (data) => {

    const payload = {
      user: user.name,
      color: user.color,
      message: data.split("").join("")
    };

    client.emit('server_message', payload);
    client.broadcast.emit('server_message', payload);
  });


  client.on('disconnect', () => {

    online--;

    let payload = {
      message: `User ${user.name} has disconnected`,
      online: online,
    };

    console.log(payload.message);
    client.broadcast.emit('client_disconnected', payload);
  });
});

server.listen(port, () => console.log(`Listen on port ${port}...`));
