var http = require('http');
var fs = require('fs');
var nicknames = [];

var server = http.createServer(function (req, res){
	fs.readFile('./index.html', function(error, data){
		res.writeHead(200, { 'Content-Type': 'text/html' });
		res.end(data, 'utf-8');
	});
});

var port = Number(process.env.PORT || 3000);
server.listen(port);

console.log('Servidor funcionando en http://127.0.0.1');

var io = require('socket.io').listen(server);



io.sockets.on('connection', function (socket) {

	io.sockets.emit('Test connection', {ping: 'pong'});

	socket.on('nickname', function (data) {   
		nicknames.push(data);
		socket.nickname = data;
		io.sockets.emit('nicknames', nicknames);   
	});

	socket.on('user message', function (data) {
	io.sockets.emit('user message', { 
		nick: socket.nickname, 
		message: data 
	});
	});

	socket.on('disconnect', function () {
		if (!socket.nickname) return;
		nicknames.splice(nicknames.indexOf(socket.nickname), 1);
	});
});