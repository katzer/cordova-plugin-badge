/*
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

var Q     = require('q');
var path  = require('path');
var shell = require('shelljs');
var Version = require('./Version');
var events = require('cordova-common').events;
var spawn = require('cordova-common').superspawn.spawn;

function MSBuildTools (version, path) {
    this.version = version;
    this.path = path;
}

MSBuildTools.prototype.buildProject = function(projFile, buildType, buildarch, otherConfigProperties) {
    events.emit('log', 'Building project: ' + projFile);
    events.emit('log', '\tConfiguration : ' + buildType);
    events.emit('log', '\tPlatform      : ' + buildarch);

    var args = ['/clp:NoSummary;NoItemAndPropertyList;Verbosity=minimal', '/nologo',
    '/p:Configuration=' + buildType,
    '/p:Platform=' + buildarch];

    if (otherConfigProperties) {
        var keys = Object.keys(otherConfigProperties);
        keys.forEach(function(key) {
            args.push('/p:' + key + '=' + otherConfigProperties[key]);
        });
    }

    return spawn(path.join(this.path, 'msbuild'), [projFile].concat(args), { stdio: 'inherit' });
};

// returns full path to msbuild tools required to build the project and tools version
module.exports.findAvailableVersion = function () {
    var versions = ['15.0', '14.0', '12.0', '4.0'];

    return Q.all(versions.map(checkMSBuildVersion)).then(function (versions) {
        // select first msbuild version available, and resolve promise with it
        var msbuildTools = versions[0] || versions[1] || versions[2] || versions[3];

        return msbuildTools ? Q.resolve(msbuildTools) : Q.reject('MSBuild tools not found');
    });
};

module.exports.findAllAvailableVersions = function () {
    var versions = ['15.0', '14.0', '12.0', '4.0'];
    events.emit('verbose', 'Searching for available MSBuild versions...');

    return Q.all(versions.map(checkMSBuildVersion)).then(function(unprocessedResults) {
        return unprocessedResults.filter(function(item) {
            return !!item;
        });
    });
};

function checkMSBuildVersion(version) {
    return spawn('reg', ['query', 'HKLM\\SOFTWARE\\Microsoft\\MSBuild\\ToolsVersions\\' + version, '/v', 'MSBuildToolsPath'])
    .then(function(output) {
        // fetch msbuild path from 'reg' output
        var toolsPath = /MSBuildToolsPath\s+REG_SZ\s+(.*)/i.exec(output);
        if (toolsPath) {
            toolsPath = toolsPath[1];
            // CB-9565: Windows 10 invokes .NET Native compiler, which only runs on x86 arch,
            // so if we're running an x64 Node, make sure to use x86 tools.
            if ((version === '15.0' || version === '14.0') && toolsPath.indexOf('amd64') > -1) {
                toolsPath = path.resolve(toolsPath, '..');
            }
            events.emit('verbose', 'Found MSBuild v' + version + ' at ' + toolsPath);
            return new MSBuildTools(version, toolsPath);
        }
    })
    .catch(function (err) {
        // if 'reg' exits with error, assume that registry key not found
        return;
    });
}

/// returns an array of available UAP Versions
function getAvailableUAPVersions() {
    /*jshint -W069 */
    var programFilesFolder = process.env['ProgramFiles(x86)'] || process.env['ProgramFiles'];
    // No Program Files folder found, so we won't be able to find UAP SDK
    if (!programFilesFolder) return [];

    var uapFolderPath = path.join(programFilesFolder, 'Windows Kits', '10', 'Platforms', 'UAP');
    if (!shell.test('-e', uapFolderPath)) {
        return []; // No UAP SDK exists on this machine
    }

    var result = [];
    shell.ls(uapFolderPath).filter(function(uapDir) {
        return shell.test('-d', path.join(uapFolderPath, uapDir));
    }).map(function(folder) {
        return Version.tryParse(folder);
    }).forEach(function(version, index) {
        if (version) {
            result.push(version);
        }
    });

    return result;
}

module.exports.getAvailableUAPVersions = getAvailableUAPVersions;
