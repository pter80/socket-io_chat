var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

/**
 * Gestion des requêtes HTTP des utilisateurs en leur renvoyant les fichiers du dossier 'public'
 */
app.use("/", express.static(__dirname + "/public"));
app.get('/hello', (req, res) => {
  res.send('<h1>Bonjour le mone</h1>');
});

io.on('connection', function (socket) {

  socket.on('disconnect', function () {
    console.log("Un utilisateur s'est déconnecté");
    
  });

  
  /**
   * Réception de l'événement 'chat-message' et réémission vers tous les utilisateurs
   */
  socket.on('chat-message', function (message) {
    io.emit('chat-message', message);
    console.log("Message inséré",message,socket.id,socket.nickname);
    });

  });
});
  

/**
 * Lancement du serveur en écoutant les connexions arrivant sur le port 3000
 */
http.listen(3000, function () {
  console.log('Le serveur écoute sur le port *:3000');
});
