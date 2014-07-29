var http = require('http');
var url = require('url');
var fs = require('fs');


var readFileFail = function(res) {
	// res.writeHead(404);
	// res.write('404, not found!');
	// res.end();
	return false;
}

var server = http.createServer(function(req, res) {
	var path = url.parse(req.url).pathname;

	if (path === '/' || path === '/index.html') {
		fs.readFile('index.html', function(err, data) {
			if (err) return readFileFail(res);
			res.writeHead(200, {'Content-type': 'text/html'});
			res.write(data, 'utf8');
			res.end();
		});
	} else {
		readFileFail(res);
	}
}).listen(8000);

var io = require('socket.io').listen(server);
io.on('connection', function(socket) {
	console.log('connection ' + socket.id + ' successful!');

	// for the first time connect
	socket.emit('connected', {hello: 'hello world!'});

	// get message from client side
	socket.on('message', function(msg) {
		console.log('received message from ' + socket.id + ': ' + msg);
	});

	// for the disconnect
	socket.on('disconnect', function() {
		console.log('connection ' + socket.id + 'terminated.');
	});
});