var GRID_ROWS = 9,
    GRID_COLUMNS = 9,
    INIT_RANDOM_NUM = 15;

var randomGridArr = initRandomGrid(GRID_ROWS, GRID_COLUMNS, INIT_RANDOM_NUM);

var http = require('http'),
    url = require('url'),
    fs = require('fs'),
    path = require('path');

var mine = {
    ".css": "text/css",
    ".gif": "image/gif",
    ".html": "text/html",
    ".ico": "image/x-icon",
    ".jpeg": "image/jpeg",
    ".jpg": "image/jpeg",
    ".js": "text/javascript",
    ".json": "application/json",
    ".pdf": "application/pdf",
    ".png": "image/png",
    ".svg": "image/svg+xml",
    ".swf": "application/x-shockwave-flash",
    ".tiff": "image/tiff",
    ".txt": "text/plain",
    ".wav": "audio/x-wav",
    ".wma": "audio/x-ms-wma",
    ".wmv": "video/x-ms-wmv",
    ".xml": "text/xml"
}; 

var server = http.createServer(function(req, res) {
	
	var pathname = url.parse(req.url).pathname;

	if(pathname === '/'){
		pathname = "index.html";
	}

	pathname = "view/" + pathname;

	fs.exists(pathname, function(exists){ 
        if(exists){
            var type = path.extname(pathname);
            if(mine[type]){
                res.writeHead(200, {"Content-Type": mine[type]}); 
            }else{
                res.writeHead(200, {"Content-Type": "application/octet-stream"});
            }

            fs.readFile(pathname,function (err,data){ 
                res.end(data); 
            }); 
        } else { 
            res.writeHead(404, {"Content-Type": "text/html"}); 
            res.end("<h1>404 Not Found</h1>"); 
        } 
    });

}).listen(8000);


var io = require('socket.io').listen(server);
io.on('connection', function(socket) {
	console.log('connection ' + socket.id + ' successful!');

    socket.emit('open', {
        row : GRID_ROWS,
        column :GRID_COLUMNS,
        randomNum :INIT_RANDOM_NUM,
        randomGridArr : randomGridArr
    });

    // 构造客户端对象
    var client = {
        socket:socket,
        name:false
    }

    // socket.on('message', function(msg) {
    //     // socket.emit('message',msg);
    //     socket.emit('message', msg)
    // });

    socket.on('run', function(data) {
        socket.broadcast.emit('run', data);
    });

    socket.on('disconnect', function(msg) {

    });

	
});

function initRandomGrid(rows, columns, randomNum) {
    var randomArr = [];
    for(var i = 0; i<randomNum; i++) {
        var r = [Math.floor(Math.random() * rows), Math.floor(Math.random() * columns)];
        randomArr.push(r);
    }

    return randomArr;
}