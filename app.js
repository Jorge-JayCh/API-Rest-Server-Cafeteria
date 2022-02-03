require('dotenv').config();

const Server = require('./models/server');

// console.log('Hola Mundooo ...... ');

const server = new Server();
server.listen();
