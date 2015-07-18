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

var Q     = require('Q'),
    path  = require('path'),
    nopt  = require('nopt'),
    shell = require('shelljs'),
    utils = require('./utils'),
    prepare = require('./prepare'),
    MSBuildTools = require('./MSBuildTools'),
    ConfigParser = require('./ConfigParser'),
    fs = require('fs');

// Platform project root folder
var ROOT = path.join(__dirname, '..', '..');
var projFiles = {
    phone: 'CordovaApp.Phone.jsproj',
    win: 'CordovaApp.Windows.jsproj',
    win80: 'CordovaApp.Windows80.jsproj',
    win10: 'CordovaApp.Windows10.jsproj'
};

// builds cordova-windows application with parameters provided.
// See 'help' function for args list
module.exports.run = function run (argv) {
    // MSBuild Tools available on this development machine
    var msbuild;

    if (!utils.isCordovaProject(ROOT)){
        return Q.reject('Could not find project at ' + ROOT);
    }

    return Q.all([parseAndValidateArgs(argv), MSBuildTools.findAvailableVersion()])
        .spread(function(buildConfig, msbuildTools) {
            // Apply build related configs
            prepare.updateBuildConfig(buildConfig);
            cleanIntermediates();
            msbuild = msbuildTools;
            console.log('MSBuildToolsPath: ' + msbuild.path);
            return buildTargets(msbuild, buildConfig);
        }, function(error) {
            return Q.reject(error);
        });
};

// help/usage function
module.exports.help = function help() {
    console.log('');
    console.log('Usage: build [--debug | --release] [--archs="<list of architectures...>"]');
    console.log('             [--phone | --win] [--packageCertificateKeyFile="key path"]');
    console.log('             [--packageThumbprint="thumbprint"] [--publisherId]');
    console.log('             [--buildConfig="file path"]');
    console.log('    --help                      : Displays this dialog.');
    console.log('    --debug                     : Builds project in debug mode. (Default).');
    console.log('    --release                   : Builds project in release mode.');
    console.log('    -r                          : (shortcut) Builds project in release mode.');
    console.log('    --archs                     : Builds project binaries for specific chip');
    console.log('                                  architectures (`anycpu`, `arm`, `x86`, `x64`).');
    console.log('    --phone, --win');
    console.log('                                : Specifies, what type of project to build.');
    console.log('    --appx=<8.1-win|8.1-phone|uap>');
    console.log('                                : Overrides windows-target-version to build');
    console.log('                                  Windows 8.1, Windows Phone 8.1, or');
    console.log('                                  Windows 10 Universal.');
    console.log('    --packageCertificateKeyFile : Builds the project using provided certificate.');
    console.log('    --packageThumbprint         : Thumbprint associated with the certificate.');
    console.log('    --publisherId               : Sets publisher id field in manifest.');
    console.log('    --buildConfig               : Sets build settings from configuration file.');
    console.log('');
    console.log('examples:');
    console.log('    build ');
    console.log('    build --debug');
    console.log('    build --release');
    console.log('    build --release --archs="arm x86"');
    console.log('    build --appx=8.1-phone -r');
    console.log('    build --packageCertificateKeyFile="CordovaApp_TemporaryKey.pfx"');
    console.log('    build --publisherId="CN=FakeCorp, C=US"');
    console.log('    build --buildConfig="build.json"');
    console.log('');

    process.exit(0);
};

function parseAndValidateArgs(argv) {
    return Q.promise(function(resolve, reject) {
        // parse and validate args
        var args = nopt({
            'debug': Boolean,
            'release': Boolean,
            'archs': [String],
            'appx': String,
            'phone': Boolean,
            'win': Boolean,
            'packageCertificateKeyFile': String,
            'packageThumbprint': String,
            'publisherId': String,
            'buildConfig': String
            }, {'-r': '--release'}, argv);

        var config = {};
        var buildConfig = {};

        // Validate args
        if (args.debug && args.release) {
            reject('Only one of "debug"/"release" options should be specified');
            return;
        }
        if (args.phone && args.win) {
            reject('Only one of "phone"/"win" options should be specified');
            return;
        }

        // get build options/defaults
        config.buildType = args.release ? 'release' : 'debug';
        config.buildArchs = args.archs ? args.archs.split(' ') : ['anycpu'];
        config.phone = args.phone ? true : false;
        config.win = args.win ? true : false;
        config.projVerOverride = args.appx;

        // if build.json is provided, parse it
        var buildConfigPath = args.buildConfig;
        if (buildConfigPath) {
            buildConfig = parseBuildConfig(buildConfigPath, config);
            for (var prop in buildConfig) { config[prop] = buildConfig[prop]; }
        }

        // CLI arguments override build.json config
        if (args.packageCertificateKeyFile) {
            args.packageCertificateKeyFile = path.resolve(process.cwd(), args.packageCertificateKeyFile);
            config.packageCertificateKeyFile = args.packageCertificateKeyFile;
        }

        config.packageThumbprint = config.packageThumbprint || args.packageThumbprint;
        config.publisherId = config.publisherId || args.publisherId;

        resolve(config);
    });
}

function parseBuildConfig(buildConfigPath, config) {
    var buildConfig, result = {};
    console.log('Reading build config file: '+ buildConfigPath);
    try {
        var contents = fs.readFileSync(buildConfigPath, 'utf8');
        buildConfig = JSON.parse(contents);
    } catch (e) {
        if (e.code === 'ENOENT') {
            throw Error('Specified build config file does not exist: ' + buildConfigPath);
        } else {
            throw e;
        }
    }

    if (buildConfig.windows && buildConfig.windows[config.buildType]) {
        var windowsInfo = buildConfig.windows[config.buildType];

        // If provided assume it's a relative path
        if(windowsInfo.packageCertificateKeyFile) {
            var buildPath = path.dirname(fs.realpathSync(buildConfigPath));
            result.packageCertificateKeyFile = path.resolve(buildPath, windowsInfo.packageCertificateKeyFile);
        }

        if(windowsInfo.packageThumbprint) {
            result.packageThumbprint = windowsInfo.packageThumbprint;
        }

        if(windowsInfo.publisherId) {
            // Quickly validate publisherId
            var publisherRegexStr = '(CN|L|O|OU|E|C|S|STREET|T|G|I|SN|DC|SERIALNUMBER|(OID\\.(0|[1-9][0-9]*)(\\.(0|[1-9][0-9]*))+))=' +
                                    '(([^,+="<>#;])+|".*")(, (' +
                                    '(CN|L|O|OU|E|C|S|STREET|T|G|I|SN|DC|SERIALNUMBER|(OID\\.(0|[1-9][0-9]*)(\\.(0|[1-9][0-9]*))+))=' +
                                    '(([^,+="<>#;])+|".*")))*';

            var publisherRegex = new RegExp(publisherRegexStr);

            if (!publisherRegex.test(windowsInfo.publisherId)) {
                throw Error('Invalid publisher id: ' + windowsInfo.publisherId);
            }

            result.publisherId = windowsInfo.publisherId;
        }
    }

    return result;
}

function buildTargets(msbuild, config) {
    // filter targets to make sure they are supported on this development machine
    var myBuildTargets = filterSupportedTargets(getBuildTargets(config), msbuild);

    var buildConfigs = [];

    // collect all build configurations (pairs of project to build and target architecture)
    myBuildTargets.forEach(function(buildTarget) {
        config.buildArchs.forEach(function(buildArch) {
            buildConfigs.push({
                target:buildTarget,
                arch: buildArch
            });
        });
    });

    // run builds serially
    return buildConfigs.reduce(function (promise, build) {
         return promise.then(function () {
            // support for "any cpu" specified with or without space
            if (build.arch == 'any cpu') {
                build.arch = 'anycpu';
            }
            // msbuild 4.0 requires .sln file, we can't build jsproj
            if (msbuild.version == '4.0' && build.target == projFiles.win80) {
                build.target = 'CordovaApp.vs2012.sln';
            }
            return msbuild.buildProject(path.join(ROOT, build.target), config.buildType,  build.arch);
         });
    }, Q());
}

function getBuildTargets(buildConfig) {
    var configXML = new ConfigParser(path.join(ROOT, 'config.xml'));
    var targets = [];
    var noSwitches = !(buildConfig.phone || buildConfig.win);

    // Windows
    if (buildConfig.win || noSwitches) { // if --win or no arg
        var windowsTargetVersion = configXML.getWindowsTargetVersion();
        switch(windowsTargetVersion) {
        case '8':
        case '8.0':
            targets.push(projFiles.win80);
            break;
        case '8.1':
            targets.push(projFiles.win);
            break;
        case '10.0':
        case 'UAP':
            targets.push(projFiles.win10);
            break;
        default:
            throw new Error('Unsupported windows-target-version value: ' + windowsTargetVersion);
        }
    }

    // Windows Phone
    if (buildConfig.phone || noSwitches) { // if --phone or no arg
        var windowsPhoneTargetVersion = configXML.getWindowsPhoneTargetVersion();
        switch(windowsPhoneTargetVersion) {
        case '8.1':
            targets.push(projFiles.phone);
            break;
        case '10.0':
        case 'UAP':
            if (!buildConfig.win && !noSwitches) {
                // Already built due to --win or no switches
                // and since the same thing can be run on Phone as Windows,
                // we can skip this one.
                targets.push(projFiles.win10);
            }
            break;
        default:
            throw new Error('Unsupported windows-phone-target-version value: ' + windowsPhoneTargetVersion);
        }
    }

    // apply build target override if one was specified
    if (buildConfig.projVerOverride) {
        switch (buildConfig.projVerOverride) {
            case '8.1-phone':
                targets = [projFiles.phone];
                break;
            case '8.1-win':
                targets = [projFiles.win];
                break;
            case 'uap':
                targets = [projFiles.win10];
                break;
            default:
                console.warn('Unrecognized --appx parameter passed to build: "' + buildConfig.projVerOverride + '", ignoring.');
                break;
        }
    }

    return targets;
}

// TODO: Fix this so that it outlines supported versions based on version criteria:
// - v14: Windows 8.1, Windows 10
// - v12: Windows 8.1, Windows 8.0
// - v4:  Windows 8.0
function msBuild4TargetsFilter(target) {
    return target === projFiles.win80;
}

function msBuild12TargetsFilter(target) {
    return target === projFiles.win80 || target === projFiles.win || target === projFiles.phone;
}

function msBuild14TargetsFilter(target) {
    return target === projFiles.win || target === projFiles.phone || target === projFiles.win10;
}

function filterSupportedTargets (targets, msbuild) {
    if (!targets || targets.length === 0) {
        console.warn('\r\nNo build targets are specified.');
        return [];
    }

    var targetFilters = {
        '4.0': msBuild4TargetsFilter,
        '12.0': msBuild12TargetsFilter,
        '14.0': msBuild14TargetsFilter
    };

    var filter = targetFilters[msbuild.version];
    if (!filter) {
        console.warn('Unsupported msbuild version "' + msbuild.version + '", aborting.');
        return [];
    }

    var supportedTargets = targets.filter(filter);
    // unsupported targets have been detected
    if (supportedTargets.length !== targets.length) {
        console.warn('Warning: Not all desired build targets are compatible with the current build environment.');
        console.warn('Please install Visual Studio 2015 for Windows 8.1 and Windows 10, or Visual Studio 2013 Update 2 for Windows 8 and 8.1.');
    }
    return supportedTargets;
}

function cleanIntermediates() {
    var buildPath = path.join(ROOT, 'build');
    if (shell.test('-e', buildPath)) {
        shell.rm('-rf', buildPath);
    }
}
