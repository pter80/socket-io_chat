/*global io*/
//var socket = io();
var socket = io("http://163.172.211.49:3000",{autoConnect:false});


$("#btConnect").on("click",function(){
    console.log ("socket",socket);
    socket.data = {username: $("#loginName").val()};
    socket.emit('send-nickname', $("#loginName").val());
    socket.connect();
    
})

/**
 * Envoi d'un message
 */
$('#chat form').submit(function (e) {
  e.preventDefault();
  var message = {
    text : $('#m').val()
  };
  $('#m').val('');
  if (message.text.trim().length !== 0) { // Gestion message vide
    socket.emit('chat-message', message);
  }
  $('#chat input').focus(); // Focus sur le champ du message
});
 
/**
 * Réception d'un message
 */
socket.on('chat-message', function (message) {
  $('#messages').append($('<li>').text(message.text));
});
