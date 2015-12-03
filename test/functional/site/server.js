var express = require('express');
var http    = require('http');
var fs      = require('fs');
var path    = require('path');
//var Promise      = require('es6-promise').Promise;
var promisify    = require('es6-promisify');
var events       = require('events');
var eventEmitter = new events.EventEmitter();

//Consts
var DEFAULT_PAGE_MARKUP = '<!DOCTYPE html>' +
                          '<html>' +
                          '<head lang="en"><meta charset="UTF-8"><title></title></head>' +
                          '<body></body>' +
                          '</html>';

var CONTENT_TYPES = {
    '.js':   'application/javascript',
    '.css':  'text/css',
    '.html': 'text/html',
    '.png':  'image/png'
};

//Utils
var readFile = promisify(fs.readFile);

//Server
var Server = function (port, basePath) {
    var server = this;

    this.app       = express();
    this.appServer = http.createServer(this.app).listen(port);
    this.sockets   = [];
    this.basePath  = basePath;

    this._setupRoutes();

    var handler = function (socket) {
        server.sockets.push(socket);
        socket.on('close', function () {
            server.sockets.splice(server.sockets.indexOf(socket), 1)
        });
    };

    this.appServer.on('connection', handler);
};

Server.prototype._setupRoutes = function () {
    var server = this;

    this.app.get('/index.html', function (req, res) {
        res.setHeader('content-type', CONTENT_TYPES['.html']);
        res.send(DEFAULT_PAGE_MARKUP);
    });

    this.app.get('/xhr-request/:delay', function (req, res) {
        var delay = req.params.delay || 0;

        setTimeout(function () {
            res.send(req.url);
        }, delay);
    });

    this.app.get('*', function (req, res) {
        var reqPath      = req.params[0] || '';
        var resourcePath = path.join(server.basePath, reqPath);

        readFile(resourcePath)
            .then(function (content) {
                res.setHeader('content-type', CONTENT_TYPES[path.extname(resourcePath)]);
                res.send(content);
            })
            .catch(function () {
                res.sendStatus(404);
            });
    });

};

Server.prototype.close = function () {
    this.appServer.close();
    this.sockets.forEach(function (socket) {
        socket.destroy();
    });
};

module.exports = Server;
