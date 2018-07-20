import http from 'http';
import app from './passport.js';
const server = http.Server(app);
import socketio from 'socket.io';
const io = socketio(server);
import _ from 'underscore';
import diffString from './diff';
import { convertFromRaw } from 'draft-js';

const bodyParser = require('body-parser');
const User = require('./models/models').User;
const Doc = require('./models/models').Doc;
const History = require('./models/models').History;

const roomObj = {};

io.on('connection', function (socket) {
  socket.on('newDoc', ( title, author, password )=>{
    var d = new Doc({
            title: title,
            author: author._id,
            password: password,
            collaborators: [author._id],
            content: "",
        });

        d.save().then(saved => {socket.emit('newDoc', JSON.stringify(saved));})
  })

  socket.on('allDocs', userId =>{
    Doc.find().lean().populate("collaborators").populate("author").populate("history").exec()
      .then(documents => {
        socket.emit('allDocs', JSON.stringify(documents));
      })
  });

  socket.on('add', (docId, password, user) => {
    Doc.findById(docId).lean().populate("author").exec()
    .then(doc => {
      if (doc.password === password && doc.collaborators.length < 7 ){
        let tempDocsArr = doc.collaborators.slice();
        tempDocsArr.push(user);
        socket.emit('add', JSON.stringify(doc));
        Doc.findByIdAndUpdate(docId, { collaborators: tempDocsArr })
           .then(updated => console.log("updated", updated));
      } else{
        console.log('wrong password');
        // socket.emit('error', 'Wrong Password')
      }
    }).catch(err => {
      console.log('doc does not exist');
      // socket.emit('error', 'Document does not exist')
    })
  })

  socket.on('save', (docId, content) => {
    Doc.findByIdAndUpdate(docId, {content: JSON.stringify(content)})
       .then(saved => console.log(saved)).catch(err=>{console.error(err)})
  })

  socket.on('historySave', (docId, content, user) => {
    let prev = "";
    History.find({docId: docId})
           .then(arr => {
             let prevDoc = arr.pop();
             console.log("histories", arr);
             console.log('prevDoc', prevDoc);
             if (prevDoc){
               prev = convertFromRaw(JSON.parse(prevDoc.content)).getPlainText();
             }
             const newStr = convertFromRaw(content).getPlainText();
             const change = diffString(prev, newStr);
             const h = new History({
               docId: docId,
               saver: user._id,
               content: JSON.stringify(content),
               time: new Date(),
               HTMLDiff: change,
             })

             h.save().then(saved => {
               let listHis = [];
               Doc.findById(docId).then(doc => {console.log("doc", doc); listHis = doc.history.slice()});
               listHis.push(saved._id);
               console.log("history", listHis);
               Doc.findByIdAndUpdate(docId, {history: listHis}).then(()=>console.log('updated hist'));
               socket.emit('newHistory', JSON.stringify(saved));
             });
           })
           .catch(err => console.error(err));

  })

  socket.on('join', (docId, user) => {
    io.of('/').in(docId).clients((err, clients) => {
      var numClients = clients.length;
      console.log("num clients", numClients)
      if (numClients === 0){
        socket.join(docId, () => {
          //instantiate colors
          roomObj[docId] = {
            "red": user._id,
            "blue": null,
            "purple": null,
            "green": null,
            "brown": null,
            "yellow": null,
          };
          socket.emit('joined', 'red');
          socket.color = String('red');
          console.log(user.name, socket.color);
        })
      } else if (numClients !== 6) {
        socket.join(docId, () => {
          for (const color in roomObj[docId]){
            if (!roomObj[docId][color]){
              roomObj[docId][color] = user._id;
              socket.emit('joined', color)
              socket.to(docId).emit('joinmsg', `${user.name} joined as ${color}`, color);
              socket.color = String(color);
              console.log(user.name, socket.color);
              break;
            }
          }
        })
      }
      socket.room = String(docId);
    });
  })

  socket.on('content', (msg, currentLoc, color) => {
    console.log(msg);
    socket.to(socket.room).emit('content', msg, currentLoc, color);
  })

  socket.on('focus', (selection, color) => {
    console.log("focus", socket.color, selection);
    socket.to(socket.room).emit('focus', selection, color);
  })

  socket.on('leave', (docId, user) => {
    socket.leave(docId);
    roomObj[docId][socket.color] = null;
  })
});

server.listen(2000, '127.0.0.1');

console.log('Server running at http://127.0.0.1:2000/');
