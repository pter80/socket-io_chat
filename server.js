var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');





async function main() {
  // open the database file
  console.log("Ouverture de la base de données");
  const db = await open({
    filename: 'chat.db',
    driver: sqlite3.Database
  });

  // create our 'messages' table (you can ignore the 'client_offset' column for now)
  await db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        client_offset TEXT UNIQUE,
        content TEXT
    );
  `);
  return db;
}
  
async function addRecord(db,message,socket) {
    await db.run(`INSERT INTO messages (content) VALUES (?)`,[message.text],function(err) {
      if (err) {
        return console.log(err.message);
      }
      console.log("Message inséré",message,socket.id);
    });
}
  

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
    addRecord(dtBase,message,socket);
    
  
  });
})

/**
 * Lancement du serveur en écoutant les connexions arrivant sur le port 3000
 */
http.listen(3000, function () {
  console.log('Le serveur écoute sur le port *:3000');
  
});
let dtBase=main();
console.log(dtBase);
addRecord(dtBase,{text:"coucou"},socket);
