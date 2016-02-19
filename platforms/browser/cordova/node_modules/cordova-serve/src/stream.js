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

var fs = require('fs'),
    mime = require('mime'),
    zlib = require('zlib');

// d8 is a date parsing and formatting micro-framework
// Used only for RFC 2822 formatting
require('d8');
require('d8/locale/en-US');

/**
 * Streams a file
 * @param {string} filePath - the file to stream (if a readStream is provided, this can be a dummy file name to provide mime type)
 * @param {http.IncomingMessage} request - request object provided by request event.
 * @param {http.ServerResponse} response - response object provided by request event.
 * @param {ReadStream} [readStream] - an optional read stream (for custom handling).
 * @param {boolean} [noCache] - if true, response header Cache-Control will be set to 'no-cache'.
 * @returns {ReadStream} - the provided ReadStream, otherwise one created for the specified file.
 */
module.exports = function (filePath, request, response, readStream, noCache) {
    if ((typeof readStream) === 'boolean') {
        noCache = readStream;
        readStream = null;
    }

    var mimeType = mime.lookup(filePath);
    var respHeaders = {
        'Content-Type': mimeType
    };

    if (!readStream) {
        readStream = fs.createReadStream(filePath);
    }

    var acceptEncoding = request.headers['accept-encoding'] || '';
    if (acceptEncoding.match(/\bgzip\b/)) {
        console.log('gzip');
        respHeaders['content-encoding'] = 'gzip';
        readStream = readStream.pipe(zlib.createGzip());
    } else if (acceptEncoding.match(/\bdeflate\b/)) {
        console.log('deflate');
        respHeaders['content-encoding'] = 'deflate';
        readStream = readStream.pipe(zlib.createDeflate());
    }

    respHeaders['Last-Modified'] = new Date(fs.statSync(filePath).mtime).format('r');
    if (noCache) {
        respHeaders['Cache-Control'] = 'no-cache';
    }
    console.log('200 ' + request.url + ' (' + filePath + ')');
    response.writeHead(200, respHeaders);
    readStream.pipe(response);
    return readStream;
};
