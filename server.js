/***********************
*   MCLUHAN.JS Server
***********************/

/* "node server.js" starts local server with this script */
var express = require('express');
var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));
app.get('/', function(req, res){
  res.sendFile(__dirname+'/index.html');
});



/* For future usernames */
var usernames = {};

var state = "cover";


io.on('connection', function(socket){
  console.log('a user connected');

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

http.listen(8080, function(){
  console.log('listening on *:8080');
});




io.sockets.on('connection', function (socket) {

	var name = "user"+~~(Math.random()*100000);
	socket.username = name;
	usernames[name] = name;
	io.sockets.emit('updateusers', usernames);
//	io.sockets.emit('loadpage', state, 0);
		
	/* Transmitted data goes through here */	
	socket.on('send', function (type, data) {
		/* return update chat */
		io.sockets.emit('update', type, data);
	});

	socket.on('disconnect', function() {
		delete usernames[socket.username];
		io.sockets.emit('updateusers', usernames);
	});

});