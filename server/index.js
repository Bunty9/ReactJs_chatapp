'use strict'
const express = require('express')
const http = require('http')
const socketio = require('socket.io')
const routes  = require('./routes')

// Create the express app
const app = express()
const server = http.createServer(app)
const io = socketio(server)
const port = process.env.PORT || 5000

io.on('connection', (socket) => {
  console.log('a user connected');
  
  
  socket.on('join', ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room });

    if(error) return callback(error);

    socket.join(user.room);

    socket.emit('message', { user: 'admin', text: `${user.name}, welcome to room ${user.room}.`});
    socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined!` });

    io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });

    callback();
  });


  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

});


app.use(routes)
// Error handlers
app.use(function fourOhFourHandler (req, res) {
  res.status(404).send()
})
app.use(function fiveHundredHandler (err, req, res, next) {
  console.error(err)
  res.status(500).send()
})

// Start server
app.listen(port, function (err) {
  if (err) {
    return console.error(err)
  }

  console.log(`server started at ${port}`)
})
