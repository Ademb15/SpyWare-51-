const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json({ limit: '50mb' }));

io.on('connection', (socket) => {
  console.log('🔗 متصل:', socket.id);
  socket.emit('your-id', socket.id);

  socket.on('video-frame', (data) => {
    socket.broadcast.emit('video-frame', data);
  });

  socket.on('disconnect', () => {
    console.log('❌ قطع:', socket.id);
  });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 شغال على المنفذ ${PORT}`);
});
