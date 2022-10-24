const port = process.env.PORT || 8900;

const io = require('socket.io')(port, {
  cors: {
    origin: 'http://localhost:3000',
  },
});

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on('connection', (socket) => {
  console.log(users);

  // when user connect
  // console.log("A user connected");
  // get userId sent by user and add socket Id along with it in users.
  socket.on('addUser', (userId) => {
    addUser(userId, socket.id);
    io.emit('getUsers', users);
  });

  // send and get message
  socket.on('sendMessage', ({ senderId, receiverId, text }) => {
    const user = getUser(receiverId);
    console.log(text);
    // console.log(users);
    console.log(senderId);
    console.log(receiverId);
    user &&
      io.to(user.socketId).emit('getMessage', {
        senderId,
        text,
      });
  });

  // when user disconnect
  socket.on('disconnect', () => {
    // console.log('A user disconnected!');
    // console.log(users);
    removeUser(socket.id);
    io.emit('getUsers', users);
  });
});
