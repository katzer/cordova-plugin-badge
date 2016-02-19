/**
 Licensed to the Apache Software Foundation (ASF) under one
 or more contributor license agreements.  See the NOTICE file
 distributed with this work for additional information
 regarding copyright ownership.  The ASF licenses this file
 to you under the Apache License, Version 2.0 (the
 "License"); you may not use this file except in compliance
 with the License.  You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an
 "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 KIND, either express or implied.  See the License for the
 specific language governing permissions and limitations
 under the License.
 */

var fs     = require('fs'),
    http   = require('http'),
    url    = require('url'),
    path   = require('path'),
    Q      = require('q'),
    stream = require('./stream');

/**
 * @desc Launches a server with the specified options and optional custom handlers.
 * @param {{root: ?string, port: ?number, urlPathHandler: ?function, streamHandler: ?function, serverExtender: ?function}} opts
 *     urlPathHandler(urlPath, request, response, do302, do404, serveFile) - an optional method to provide custom handling for
 *         processing URLs and serving up the resulting data. Can serve up the data itself using response.write(), or determine
 *         a custom local file path and call serveFile to serve it up, or do no processing and call serveFile with no params to
 *         treat urlPath as relative to the root.
 *     streamHandler(filePath, request, response) - an optional custom stream handler, to stream whatever you want. If not
 *         provided, the file referenced by filePath will be streamed. Return true if the file is handled.
 *     serverExtender(server, root) - if provided, is called as soon as server is created so caller can attached to events etc.
 * @returns {*|promise}
 */
module.exports = function (opts) {
    var deferred = Q.defer();

    opts = opts || {};
    var root = opts.root;
    var port = opts.port || 8000;

    var server = http.createServer(function (request, response) {
        function do404() {
            console.log('404 ' + request.url);
            response.writeHead(404, {'Content-Type': 'text/plain'});
            response.write('404 Not Found\n');
            response.end();
        }

        function do302(where) {
            console.log('302 ' + request.url);
            response.setHeader('Location', where);
            response.writeHead(302, {'Content-Type': 'text/plain'});
            response.end();
        }

        function do304() {
            console.log('304 ' + request.url);
            response.writeHead(304, {'Content-Type': 'text/plain'});
            response.end();
        }

        function isFileChanged(path) {
            var mtime = fs.statSync(path).mtime,
                itime = request.headers['if-modified-since'];
            return !itime || new Date(mtime) > new Date(itime);
        }

        var urlPath = url.parse(request.url).pathname;

        if (opts.urlPathHandler) {
            opts.urlPathHandler(urlPath, request, response, do302, do404, serveFile);
        } else {
            serveFile();
        }

        function serveFile(filePath) {
            if (!filePath) {
                if (!root) {
                    throw new Error('No server root directory HAS BEEN specified!');
                }
                filePath = path.join(root, urlPath);
            }

            fs.exists(filePath, function (exists) {
                if (!exists) {
                    do404();
                    return;
                }
                if (fs.statSync(filePath).isDirectory()) {
                    var index = path.join(filePath, 'index.html');
                    if (fs.existsSync(index)) {
                        filePath = index;
                    }
                }
                if (fs.statSync(filePath).isDirectory()) {
                    if (!/\/$/.test(urlPath)) {
                        do302(request.url + '/');
                        return;
                    }
                    console.log('200 ' + request.url);
                    response.writeHead(200, {'Content-Type': 'text/html'});
                    response.write('<html><head><title>Directory listing of ' + urlPath + '</title></head>');
                    response.write('<h3>Items in this directory</h3>');
                    response.write('<ul>');
                    fs.readdirSync(filePath).forEach(function (file) {
                        response.write('<li><a href="' + file + '">' + file + '</a></li>\n');
                    });

                    response.write('</ul>');
                    response.end();
                } else if (!isFileChanged(filePath)) {
                    do304();
                } else {
                    var streamHandler = opts.streamHandler || stream;
                    streamHandler(filePath, request, response);
                }
            });
        }
    }).on('listening', function () {
        console.log('Static file server running on port ' + port + ' (i.e. http://localhost:' + port + ')\nCTRL + C to shut down');
        deferred.resolve({server: server, port: port});
    }).on('error', function (e) {
        if (e && e.toString().indexOf('EADDRINUSE') !== -1) {
            port++;
            server.listen(port);
        } else {
            deferred.reject(e);
        }
    }).listen(port);

    if (opts.serverExtender) {
        opts.serverExtender(server, root);
    }

    return deferred.promise;
};
