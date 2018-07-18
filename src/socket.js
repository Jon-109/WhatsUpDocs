import socketIO from 'socket.io-client';
const path = 'http://127.0.0.1:2000'

const socket = socketIO(path);

export default socket;
