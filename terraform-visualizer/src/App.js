const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const localStatePath = process.env.LOCAL_TFSTATE_PATH || path.join(__dirname, 'terraform.tfstate');

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

// Catch all handler to return the React app for any route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

io.on('connection', (socket) => {
  console.log('New client connected');

  const sendState = () => {
    fs.readFile(localStatePath, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading state file:', err);
        return;
      }
      socket.emit('stateUpdate', JSON.parse(data));
    });
  };

  sendState();

  const watcher = fs.watch(localStatePath, sendState);

  socket.on('disconnect', () => {
    console.log('Client disconnected');
    watcher.close();
  });
});

server.listen(5000, () => console.log('Server is listening on port 5000'));