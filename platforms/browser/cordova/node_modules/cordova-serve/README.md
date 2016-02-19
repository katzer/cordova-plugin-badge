<!--
#
# Licensed to the Apache Software Foundation (ASF) under one
# or more contributor license agreements.  See the NOTICE file
# distributed with this work for additional information
# regarding copyright ownership.  The ASF licenses this file
# to you under the Apache License, Version 2.0 (the
# "License"); you may not use this file except in compliance
# with the License.  You may obtain a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing,
# software distributed under the License is distributed on an
# "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
#  KIND, either express or implied.  See the License for the
# specific language governing permissions and limitations
# under the License.
#
-->

# cordova-serve
This module can be used to serve up a Cordova application in the browser. It has no command-line, but rather is intended
to be called using the following API:

``` js
var serve = require('cordova-serve');
serve.launchServer(opts);
serve.servePlatform(platform, opts);
serve.launchBrowser(ops);
serve.sendStream(filePath, request, response[, readStream][, noCache]);
```

## launchServer()

``` js
launchServer(opts);
```

Launches a server with the specified options. Parameters:

* **opts**: Options, as described below.

## servePlatform()

``` js
servePlatform(platform, opts);
```

Launches a server that serves up any Cordova platform (e.g. `browser`, `android` etc) from the current project.
Parameters:

* **opts**: Options, as described below. Note that for `servePlatform()`, the `root` value should be a Cordova project's
  root folder, or any folder within it - `servePlatform()` will replace it with the platform's `www_dir` folder. If this
  value is not specified, the *cwd* will be used.

## launchBrowser()

``` js
launchBrowser(opts);
```

Launches a browser window pointing to the specified URL. The single parameter is an options object that supports the
following values (both optional):

* **url**: The URL to open in the browser.
* **target**: The name of the browser to launch. Can be any of the following: `chrome`, `chromium`, `firefox`, `ie`,
  `opera`, `safari`. If no browser is specified, 

## sendStream()

``` js
sendStream(filePath, request, response[, readStream][, noCache]);
```

The server uses this method to stream files, and it is provided as a convenience method you can use if you are
customizing the stream by specifying `opts.streamHandler`. Parameters:

* **filePath**: The absolute path to the file to be served (which will have been passed to your `streamHandler`).
* **request**: The request object (which will have been passed to your `streamHandler`).
* **response**: The response object (which will have been passed to your `streamHandler`).
* **readStream**: (optional) A custom read stream, if required.
* **noCache**: (optional) If true, browser caching will be disabled for this file (by setting response header
  Cache-Control will be set to 'no-cache')

## The *opts* Options Object
The opts object passed to `launchServer()` and `servePlatform()` supports the following values (all optional):

* **root**: The file path on the local file system that is used as the root for the server, for default mapping of URL
  path to local file system path.   
* **port**: The port for the server. Note that if this port is already in use, it will be incremented until a free port
  is found.
* **urlPathHandler**: An optional method to provide custom handling for processing URLs and serving up the resulting data.
  Can serve up the data itself using `response.write()`, or determine a custom local file path and call `serveFile()` to
  serve it up, or do no processing and call `serveFile` with no params to treat `urlPath` as relative to the root.
* **streamHandler**: An optional custom stream handler - `cordova-serve` will by default stream files using
  `sendStream()`, described above, which just streams files, but will first call this method, if provided, to
  support custom streaming. This method is described in more detail below.
* **serverExtender**: This method is called as soon as the server is created, so that the caller can do
  additional things with the server (like attach to certain events, for example). This method is described in more
  detail below.

## urlPathHandler()
Provide this method if you need to do custom processing of URL paths (that is, custom mapping of URL path to local file
path) and potentially directly handle serving up the resulting data. The signature of this method is as follows:

``` js
urlPathHandler(urlPath, request, response, do302, do404, serveFile)
```

Parameters:

* **urlPath**: The URL path to process. It is the value of `url.parse(request.url).pathname`.
* **request**: The server request object.
* **response**: The server response object.
* **do302**: A helper method to do a 302 HTTP response (redirection). It takes a single parameter - the URL to redirect to.
* **do404**: A helper method to do a 404 HTTP response (not found).
* **serveFile**: A helper method to serve up the resulting file. If `urlPathHandler()` doesn't write the response itself,
  it should call this method either passing it the local file path to be served, or passing it nothing. In the latter case,
  it will treat `urlPath` as relative to the root.

## streamHandler()
Provide this method if you wish to perform custom stream handling. The signature of this method is as follows:

``` js
streamHandler(filePath, request, response)
```

Parameters:

* **filePath**: This is the path to the local file that will be streamed. It might be the value you returned from
  urlPathProcessor(), in which case it doesn't necessarily have to reference an actual file: it might just be an
  identifier string that your custom stream handler will recognize. If you are going to end up calling `sendStream()`,
  it is useful if even a fake file name has a file extension, as that is used for mime type lookup.
* **request**: The server request object.
* **response**: The serve response object.

Return value:

Return `true` if you have handled the stream request, otherwise `false`.

## serverExtender()

If you provide this method, it will be called as soon as the server is created. It allows you to attach additional
functionality to the server, such has event handlers, web sockets etc.  The signature of this method is as follows:

``` js
serverExtender(server, root)
```

Parameters:

* **server**: A reference to the server (the result of calling `http.createServer()`).
* **root**: The file path on the local file system that is used as the root for the server (if it was provided), for
  default mapping of URL path to local file system path.

