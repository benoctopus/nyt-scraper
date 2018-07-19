const Odm = require('../db/odm');

const odm = new Odm();

const handlers = [
  // main authentication route
  socket => (
    socket.on('authenticate', (data) => {
      if (!data.signUp) {
        odm.authenticate(data)
          .then(result => socket.emit('authenticated', result));
      } else {
        odm.createUser(data)
          .then(result => socket.emit('authenticated', result));
      }
    })
  ),

  // sign in token validation
  socket => (
    socket.on('token_check', (data) => {
      odm.validateToken(data.token)
        .then(result => socket.emit('valid_token', result));
    })
  )
];

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('Client connected');
    handlers.forEach(handler => handler(socket));
  });
};
