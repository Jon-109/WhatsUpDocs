import http from 'http';
import app from './passport.js';
const server = http.Server(app);
import socketio from 'socket.io';
const io = socketio(server);
import _ from 'underscore';

io.on('connection', function (socket) {
  socket.emit('msg', { hello: 'world' });
  socket.on('cmd', function (data) {
    console.log(data);
  });
});

server.listen(1337, '127.0.0.1');

console.log('Server running at http://127.0.0.1:1337/');
