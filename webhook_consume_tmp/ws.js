const express = require('express');
const http = require('http');
const WebSocket = require('ws');

// Initialize Express and HTTP server
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Serve a basic message at the root route to confirm server status
app.get('/', (req, res) => {
  res.send('Notification server is running');
});

// WebSocket connection handler
wss.on('connection', ws => {
  console.log('New client connected');

  // When a client disconnects
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// Endpoint to send notifications to all connected clients
app.use(express.json());
app.post('/notify', (req, res) => {
  const { message } = req.body;

  // Broadcast the message to all connected WebSocket clients
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });

  res.send('Notification sent');
});

// Start the server
server.listen(8088, () => {
  console.log('Server is listening on port 8088');
});
