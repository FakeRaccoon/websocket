const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function connection(ws) {

  console.log('Number of clients connected:', wss.clients.size);

  ws.on('message', function incoming(message) {

    var decode = JSON.parse(message);

    var modifiedMessage = {
      "username": decode.username,
      "time_stamp": decode.time_stamp,
      "message": decode.message,
      "avatar": decode.avatar,
      "like": decode.like,
      "combined_string": decode.combined_string,
      "connection_count": wss.clients.size,
    }

    wss.clients.forEach(function each(client) {
      client.send(JSON.stringify(modifiedMessage));
    });

  });

  ws.on('close', function close() {
    wss.clients.forEach(function each(client) {
      if(client.OPEN) client.send(JSON.stringify({"connection_count": wss.clients.size}));
    });
    console.log('Client disconnected, number of clients left:', wss.clients.size);
  });
});

console.log('WebSocket server is running on port 8080');
