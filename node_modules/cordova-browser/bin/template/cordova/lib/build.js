#!/usr/bin/env node

/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var fs = require('fs');
var path = require('path');
var shell = require('shelljs');
var check_reqs = require('./check_reqs');

/**
 * run
 *   Creates a zip file int platform/build folder
 */
module.exports.run = function () {

    var resultP = check_reqs.run();

    resultP.then(function () {
        var wwwPath = path.join(__dirname, '../../www');

        // generate a generic service worker
        var lsdir = shell.find(wwwPath);
        var pathLength = wwwPath.length;
        var cleanedFileList = lsdir.filter(function (elem) {
            // skip directory names, and cordova-js-src
            return !fs.statSync(elem).isDirectory() &&
                    elem.indexOf('cordova-js-src') < 0;
        }).map(function (elem) {
            return elem.substr(pathLength);
        });

        var swJSPath = path.join(wwwPath, 'cordova-sw.js');
        var swJS = fs.readFileSync(swJSPath, 'utf8');

        swJS = swJS.replace('%CACHE_VERSION%', Date.now());
        swJS = swJS.replace("['CACHE_VALUES']", JSON.stringify(cleanedFileList, null, 4));

        fs.writeFileSync(swJSPath, swJS, 'utf8');
    });
    return resultP;
};

module.exports.help = function () {
    console.log('Usage: cordova build browser');
    var wwwPath = path.resolve(path.join(__dirname, '../../www'));
    console.log("Build will create the packaged app in '" + wwwPath + "'.");
};
