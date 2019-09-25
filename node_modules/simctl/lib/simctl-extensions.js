/*
The MIT License (MIT)

Copyright (c) 2014 Shazron Abdullah.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

var shell = require('shelljs');
var path = require('path');
var fs = require('fs');
var util = require('util');
var Tail = require('tail').Tail;

var extensions = {
    start: function (deviceid) {
        var is_at_least_xcode_9 = false;

        var command = 'xcodebuild -version';
        var output = shell.exec(command, { silent: true }).output;

        // parse output for Xcode version
        var versionMatch = /Xcode (.*)/.exec(output);
        if (!versionMatch) {
            console.log('Unable to parse xcodebuild version.');
            return;
        } else {
            is_at_least_xcode_9 = (parseInt(versionMatch[1]) >= 9);
        }

        if (is_at_least_xcode_9) {
            // Xcode 9 or greater
            command = util.format('xcrun simctl list -j');
            var res = shell.exec(command, { silent: true });
            if (res.code !== 0) {
                console.log('Unable to parse xcodebuild version.');
                return;
            }
            var list_output = JSON.parse(res.output);
            var device = Object.keys(list_output.devices)
                .reduce(function (acc, key) { return acc.concat(list_output.devices[key]); }, [])
                .find(function (el) { return el.udid === deviceid; });

            if (device.state === 'Booted') {
                // no need to launch the emulator, it is already running
                console.log('Simulator already running.');
                return;
            }
            command = util.format('xcrun simctl boot "%s"', deviceid);
            shell.exec(command, { silent: true });
            command = 'open `xcode-select -p`/Applications/Simulator.app';
            return shell.exec(command, { silent: true });
        } else {
            // Xcode 8 or older
            command = util.format('xcrun instruments -w "%s"', deviceid);
            return shell.exec(command, { silent: true });
        }
    },

    log: function (deviceid, filepath) {
        var tail = new Tail(
            path.join(process.env.HOME, 'Library/Logs/CoreSimulator', deviceid, 'system.log')
        );

        tail.on('line', function (data) {
            if (filepath) {
                fs.appendFile(filepath, data + '\n', function (error) {
                    if (error) {
                        console.error('ERROR: ', error);
                        throw error;
                    }
                });
            } else {
                console.log(data);
            }
        });

        tail.on('error', function (error) {
            console.error('ERROR: ', error);
        });

        return tail;
    }
};

exports = module.exports = extensions;
