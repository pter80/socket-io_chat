var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');


let db = new sqlite3.Database('chat.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the chat database.');


});
db.exec(`CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        content TEXT, sender TEXT, senderId TEXT)`,(err)=>{
          if (err) {
            console.log(err.message);
          }
        console.log("Table créée");
        });
  

/**
 * Gestion des requêtes HTTP des utilisateurs en leur renvoyant les fichiers du dossier 'public'
 */

app.use("/", express.static(__dirname + "/public"));
app.get('/hello', (req, res) => {
  res.send('<h1>Bonjour le mone</h1>');
});

io.on('connection', function (socket) {
  console.log('Un utilisateur est connecté',socket.id,socket.nickname);
  socket.on('disconnect', function () {
    console.log("Un utilisateur s'est déconnecté");
    
  });
  socket.on('send-nickname', function (nickname) {
    //io.emit('chat-message', message);
    socket.nickname=nickname;
    console.log("Cet utilisateur se connecte",socket.id,socket.nickname);
  });
  
  /**
   * Réception de l'événement 'chat-message' et réémission vers tous les utilisateurs
   */

  socket.on('chat-message', function (message) {
    io.emit('chat-message', message);
    
    db.run(`INSERT INTO messages (content) VALUES (?)`,[message.text],function(err) {
      if (err) {
        return console.log(err.message);
      }
      console.log("Message inséré",message,socket.id);
    });
  
  });
})

/**
 * Lancement du serveur en écoutant les connexions arrivant sur le port 3000
 */
http.listen(3000, function () {
  console.log('Le serveur écoute sur le port *:3000');
  
});

