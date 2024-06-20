const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const localStatePath = process.env.LOCAL_TFSTATE_PATH || path.join(__dirname, 'terraform.tfstate');

// Add a route for the root URL
app.get('/', (req, res) => {
  res.send('Welcome to the Terraform State Visualizer!');
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