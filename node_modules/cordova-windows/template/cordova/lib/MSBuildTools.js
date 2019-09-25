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

var Q = require('q');
var path = require('path');
var fs = require('fs');
var shell = require('shelljs');
var Version = require('./Version');
var events = require('cordova-common').events;
var spawn = require('cordova-common').superspawn.spawn;

function MSBuildTools (version, path) {
    this.version = version;
    this.path = path;
}

MSBuildTools.prototype.buildProject = function (projFile, buildType, buildarch, buildFlags) {
    events.emit('log', 'Building project: ' + projFile);
    events.emit('log', '\tConfiguration : ' + buildType);
    events.emit('log', '\tPlatform      : ' + buildarch);
    events.emit('log', '\tBuildflags    : ' + buildFlags);
    events.emit('log', '\tMSBuildTools  : ' + this.path);

    // Additional requirement checks
    var checkWinSDK = function (target_platform) {
        return require('./check_reqs').isWinSDKPresent(target_platform);
    };
    var checkPhoneSDK = function () {
        return require('./check_reqs').isPhoneSDKPresent();
    };

    // default build args
    var args = ['/clp:NoSummary;NoItemAndPropertyList;Verbosity=minimal', '/nologo',
        '/p:Configuration=' + buildType,
        '/p:Platform=' + buildarch];

    // add buildFlags if present
    if (buildFlags) {
        args = args.concat(buildFlags);
    }

    var that = this;
    var promise;

    // Check if SDK required to build the respective platform is present. If not present, return with corresponding error, else call msbuild.
    if (projFile.indexOf('CordovaApp.Phone.jsproj') > -1) {
        promise = checkPhoneSDK();
    } else if (projFile.indexOf('CordovaApp.Windows.jsproj') > -1) {
        promise = checkWinSDK('8.1');
    } else {
        promise = checkWinSDK('10.0');
    }

    return promise.then(function () {
        console.log('buildProject spawn:', path.join(that.path, 'msbuild'), [projFile].concat(args), { stdio: 'inherit' });
        return spawn(path.join(that.path, 'msbuild'), [projFile].concat(args), { stdio: 'inherit' });
    });
};

// check_reqs.js -> checkMSBuild()
module.exports.findAllAvailableVersions = function () {
    // console.log('findAllAvailableVersions');

    var msBuildPath = '';

    // Use MSBUILDDIR environment variable if defined to find MSBuild.
    // MSBUILDDIR = C:\Program Files (x86)\Microsoft Visual Studio\2017\Community\MSBuild\15.0\Bin
    // MSBUILDDIR = C:\Program Files (x86)\MSBuild\14.0\bin\
    if (process.env.MSBUILDDIR) {
        console.log('ENV var MSBUILDDIR is set', process.env.MSBUILDDIR);
        msBuildPath = process.env.MSBUILDDIR;
        return module.exports.getMSBuildToolsAt(msBuildPath)
            .then(function (msBuildTools) {
                return [msBuildTools];
            })
            // If MSBUILDDIR is not specified or doesn't contain a valid MSBuild
            // - fall back to default discovery mechanism.
            .catch(findAllAvailableVersionsFallBack);
    }

    // CB-11548 use VSINSTALLDIR environment if defined to find MSBuild.
    if (process.env.VSINSTALLDIR) {
        console.log('ENV var VSINSTALLDIR is set', process.env.VSINSTALLDIR);
        msBuildPath = path.join(process.env.VSINSTALLDIR, 'MSBuild/15.0/Bin');
        return module.exports.getMSBuildToolsAt(msBuildPath)
            .then(function (msBuildTools) {
                return [msBuildTools];
            })
            // If VSINSTALLDIR is not specified or doesn't contain the MSBuild path we are
            // looking for - fall back to default discovery mechanism.
            .catch(findAllAvailableVersionsFallBack);
    }

    return findAllAvailableVersionsFallBack();
};

function findAllAvailableVersionsFallBack () {
    // console.log('findAllAvailableVersionsFALLBACK');

    var versions = ['15.5', '15.0', '14.0', '12.0', '4.0'];
    events.emit('verbose', 'Searching for available MSBuild versions...');

    return Q.all(versions.map(checkMSBuildVersion)).then(function (unprocessedResults) {
        return unprocessedResults.filter(function (item) {
            return !!item;
        });
    });
}

// returns full path to msbuild tools required to build the project and tools version
// check_reqs.js -> run()
module.exports.findAvailableVersion = function () {
    var versions = ['15.5', '15.0', '14.0', '12.0', '4.0'];

    return Q.all(versions.map(checkMSBuildVersion)).then(function (versions) {
        // console.log('findAvailableVersion', versions);
        // select first msbuild version available, and resolve promise with it
        var msbuildTools = versions[0] || versions[1] || versions[2] || versions[3] || versions[4];

        return msbuildTools ? Q.resolve(msbuildTools) : Q.reject('MSBuild tools not found');
    });
};

/**
 * Gets MSBuildTools instance for user-specified location
 *
 * @param {String}  location  FS location where to search for MSBuild
 * @returns  Promise<MSBuildTools>  The MSBuildTools instance at specified location
 */
module.exports.getMSBuildToolsAt = function (location) {
    // console.log('getMSBuildToolsAt', location);
    var msbuildExe = path.resolve(location, 'msbuild');

    // TODO: can we account on these params availability and printed version format?
    return spawn(msbuildExe, ['-version', '-nologo'])
        .then(function (output) {
            // MSBuild prints its' version as 14.0.25123.0, so we pick only first 2 segments
            var version = output.match(/^(\d+\.\d+)/)[1];
            // console.log('return `new MSBuildTools`', version, location);
            return new MSBuildTools(version, location);
        });
};

function checkMSBuildVersion (version) {
    // console.log('checkMSBuildVersion', version);

    // first, check if we have a VS 2017+ with such a version
    var willows = module.exports.getWillowInstallations();
    // console.log('willows', willows);
    var correspondingWillows = willows.filter(function (inst) {
        // console.log('willows.filter', inst.version, version, inst.version === version);
        return inst.version === version;
    });
    // console.log('correspondingWillows', correspondingWillows);
    var correspondingWillow = correspondingWillows[0]; // TODO Do not only handle one!
    if (correspondingWillow) {
        // super hacky: VS2017/Willow is 15.x but MSBuild is always 15.0 in path - so set that here
        version = '15.0';
        var toolsPath = path.join(correspondingWillow.path, 'MSBuild', version, 'Bin');
        // console.log('matching VS:', version, toolsPath);
        // console.log('from list of VS installations: ', correspondingWillows);
        if (shell.test('-e', toolsPath)) {
            var msbuild = module.exports.getMSBuildToolsAt(toolsPath);
            // console.log('selected VS exists:', toolsPath);
            // TODO check for JavaScript folder
            return msbuild;
        }
    }

    // older vs versions that were registered in registry
    return spawn('reg', ['query', 'HKLM\\SOFTWARE\\Microsoft\\MSBuild\\ToolsVersions\\' + version, '/v', 'MSBuildToolsPath'])
        .then(function (output) {
            // console.log('spawn', output);
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
        }).catch(function (err) { /* eslint handle-callback-err : 0 */
            // console.log('no registry result for version ' + version);
            // if 'reg' exits with error, assume that registry key not found
        });
}

// build.js -> run()
module.exports.getLatestMatchingMSBuild = function (selectedBuildTargets) {
    events.emit('verbose', 'getLatestMatchingMSBuild');
    // console.log('getLatestMatchingMSBuild', selectedBuildTargets);
    // TODO
    // 1. findAllAvailableVersions
    // 2. filter down to versions that can build all selectedBuildTargets
    // 3. filter for latest one of those
    return this.getLatestMSBuild()
        .then(function (msbuild) {
            // filter targets to make sure they are supported on this development machine
            var myBuildTargets = filterSupportedTargets(selectedBuildTargets, msbuild);
            return [msbuild, myBuildTargets];
        });
};

// gets the latest MSBuild version from a list of versions
module.exports.getLatestMSBuild = function () {
    events.emit('verbose', 'getLatestMSBuild');

    return this.findAllAvailableVersions()
        .then(function (allMsBuildVersions) {

            var availableVersions = allMsBuildVersions
                .filter(function (buildTools) {
                    // Sanitize input - filter out tools w/ invalid versions
                    return Version.tryParse(buildTools.version);
                }).sort(function (a, b) {
                    // Sort tools list - use parsed Version objects for that
                    // to respect both major and minor versions segments
                    var parsedA = Version.fromString(a.version);
                    var parsedB = Version.fromString(b.version);

                    if (parsedA.gt(parsedB)) return -1;
                    if (parsedA.eq(parsedB)) return 0;
                    return 1;
                });

            // console.log('availableVersions', availableVersions);

            if (availableVersions.length > 0) {
                // After sorting the first item will be the highest version available
                var msbuild = availableVersions[0];
                events.emit('verbose', 'Using MSBuild v' + msbuild.version + ' from ' + msbuild.path);
                return msbuild;
            }
        });
};

var projFiles = {
    phone: 'CordovaApp.Phone.jsproj',
    win: 'CordovaApp.Windows.jsproj',
    win10: 'CordovaApp.Windows10.jsproj'
};

// TODO: Fix this so that it outlines supported versions based on version criteria:
// - v14: Windows 8.1, Windows 10
// - v12: Windows 8.1
function msBuild12TargetsFilter (target) {
    return target === projFiles.win || target === projFiles.phone;
}

function msBuild14TargetsFilter (target) {
    return target === projFiles.win || target === projFiles.phone || target === projFiles.win10;
}

function msBuild15TargetsFilter (target) {
    return target === projFiles.win || target === projFiles.phone || target === projFiles.win10;
}

function msBuild155TargetsFilter (target) {
    return target === projFiles.win10;
}

function filterSupportedTargets (targets, msbuild) {
    // console.log('MSBuildTools->filterSupportedTargets', targets, msbuild);
    if (!targets || targets.length === 0) {
        events.emit('warn', 'No build targets specified');
        return [];
    }

    var targetFilters = {
        '12.0': msBuild12TargetsFilter,
        '14.0': msBuild14TargetsFilter,
        '15.x': msBuild15TargetsFilter,
        '15.5': msBuild155TargetsFilter,
        get: function (version) {
            // Apart from exact match also try to get filter for version range
            // so we can find for example targets for version '15.1'
            return this[version] || this[version.replace(/\.\d+$/, '.x')];
        }
    };

    var filter = targetFilters.get(msbuild.version);
    if (!filter) {
        events.emit('warn', 'MSBuild v' + msbuild.version + ' is not supported, aborting.');
        return [];
    }

    var supportedTargets = targets.filter(filter);
    // unsupported targets have been detected
    if (supportedTargets.length !== targets.length) {
        events.emit('warn', 'Not all desired build targets are compatible with the current build environment. ' +
            'Please install Visual Studio 2015 for Windows 8.1 and Windows 10, ' +
            'or Visual Studio 2013 Update 2 for Windows 8.1.');
    }
    return supportedTargets;
}

/**
 * Lists all VS 2017+ instances dirs in ProgramData
 *
 * @return {String[]} List of paths to all VS2017+ instances
 */
function getWillowProgDataPaths () {
    if (!process.env.systemdrive) {
        // running on linux/osx?
        return [];
    }
    var instancesRoot = path.join(process.env.systemdrive, 'ProgramData/Microsoft/VisualStudio/Packages/_Instances');
    if (!shell.test('-d', instancesRoot)) {
        // can't seem to find VS instances dir, return empty result
        return [];
    }

    return fs.readdirSync(instancesRoot).map(function (file) {
        var instanceDir = path.join(instancesRoot, file);
        if (shell.test('-d', instanceDir)) {
            return instanceDir;
        }
    }).filter(function (progDataPath) {
        // make sure state.json exists
        return shell.test('-e', path.join(progDataPath, 'state.json'));
    });
}

/**
 * Lists all installed VS 2017+ versions
 *
 * @return {Object[]} List of all VS 2017+ versions
 */
module.exports.getWillowInstallations = function () {
    var progDataPaths = getWillowProgDataPaths();
    var installations = [];
    progDataPaths.forEach(function (progDataPath) {
        try {
            var stateJsonPath = path.join(progDataPath, 'state.json');
            var fileContents = fs.readFileSync(stateJsonPath, 'utf-8');
            var state = JSON.parse(fileContents);
            // get only major and minor version
            var version = state.product.version.match(/^(\d+\.\d+)/)[1];
            installations.push({ version: version, path: state.installationPath });
        } catch (err) {
            // something's wrong, skip this one
        }
    });
    return installations;
};

// returns an array of available UAP Versions
// prepare.js
module.exports.getAvailableUAPVersions = function () {
    var programFilesFolder = process.env['ProgramFiles(x86)'] || process.env['ProgramFiles'];
    // No Program Files folder found, so we won't be able to find UAP SDK
    if (!programFilesFolder) return [];

    var uapFolderPath = path.join(programFilesFolder, 'Windows Kits', '10', 'Platforms', 'UAP');
    if (!shell.test('-e', uapFolderPath)) {
        return []; // No UAP SDK exists on this machine
    }

    var result = [];
    shell.ls(uapFolderPath).filter(function (uapDir) {
        return shell.test('-d', path.join(uapFolderPath, uapDir));
    }).map(function (folder) {
        return Version.tryParse(folder);
    }).forEach(function (version, index) {
        if (version) {
            result.push(version);
        }
    });

    return result;
};
