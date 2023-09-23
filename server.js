const { response } = require('express');
const express = require('express');
const app = express();
const port = process.env.PORT || 8000;
// require('./db/connection');
const Model = require('./models/model');
app.use(express.static('./public'));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('abhishek');
});

const server = app.listen(port, () => {
  console.log(`lintening at port number ${port}`);
});

// socket connection code start here

let io = require('socket.io')(server);

io.on('connection', (socket) => {
  console.log(`new connection ${socket.id}`);

  let id;
  // new user connected
  socket.on('new connection', (data) => {
    console.log(data);
    id = setInterval(() => {
      console.log('Call', socket.id);
    }, 5000);
    socket.broadcast.emit('new connection', data);
  });
  //recieve event
  socket.on('comment', (data) => {
    // com = name hai kuch bhi de sakte hai
    data.time = Date();
    socket.broadcast.emit('com', data);
  });

  socket.on('typing', (data) => {
    socket.broadcast.emit('typing', data);
  });

  socket.on('disconnect', () => {
    clearInterval(id);
    console.log('disconnect', socket.id);
  });
});

// socket connection code start here

// db

app.post('/api/comments', (req, res) => {
  const register = new Model({
    username: req.body.username,
    comment: req.body.comment,
  });
  register.save().then((response) => {
    res.send(response);
  });
});

app.get('/api/comments', (req, res) => {
  Model.find().then((comment) => {
    res.send(comment);
  });
});
