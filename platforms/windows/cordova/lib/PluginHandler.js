/*
 *
 * Copyright 2013 Jesse MacFadyen
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
 */

/* jshint sub:true */

var fs   = require('fs');
var path = require('path');
var shell = require('shelljs');
var events = require('cordova-common').events;
var CordovaError = require('cordova-common').CordovaError;

var handlers = {
    'source-file': {
        install:function(obj, plugin, project, options) {
            var dest = path.join('plugins', plugin.id, obj.targetDir || '', path.basename(obj.src));
            copyNewFile(plugin.dir, obj.src, project.root, dest);
            // add reference to this file to jsproj.
            project.addSourceFile(dest);
        },
        uninstall:function(obj, plugin, project, options) {
            var dest = path.join('plugins', plugin.id, obj.targetDir || '', path.basename(obj.src));
            removeFile(project.root, dest);
            // remove reference to this file from csproj.
            project.removeSourceFile(dest);
        }
    },
    'resource-file':{
        install:function(obj, plugin, project, options) {
            // as per specification resource-file target is specified relative to platform root
            copyFile(plugin.dir, obj.src, project.root, obj.target);
            project.addResourceFileToProject(obj.target, getTargetConditions(obj));
        },
        uninstall:function(obj, plugin, project, options) {
            removeFile(project.root, obj.target);
            project.removeResourceFileFromProject(obj.target, getTargetConditions(obj));
        }
    },
    'lib-file': {
        install:function(obj, plugin, project, options) {
            var inc  = obj.Include || obj.src;
            project.addSDKRef(inc, getTargetConditions(obj));
        },
        uninstall:function(obj, plugin, project, options) {
            events.emit('verbose', 'windows lib-file uninstall :: ' + plugin.id);
            var inc = obj.Include || obj.src;
            project.removeSDKRef(inc, getTargetConditions(obj));
        }
    },
    'framework': {
        install:function(obj, plugin, project, options) {
            events.emit('verbose', 'windows framework install :: ' + plugin.id);

            var src = obj.src;
            var dest = src;
            var type = obj.type;

            if(type === 'projectReference') {
                project.addProjectReference(path.join(plugin.dir,src), getTargetConditions(obj));
            }
            else {
                var targetDir = obj.targetDir || '';
                // path.join ignores empty paths passed so we don't check whether targetDir is not empty
                dest = path.join('plugins', plugin.id, targetDir, path.basename(src));
                copyFile(plugin.dir, src, project.root, dest);
                project.addReference(dest, getTargetConditions(obj));
            }

        },
        uninstall:function(obj, plugin, project, options) {
            events.emit('verbose', 'windows framework uninstall :: ' + plugin.id  );

            var src = obj.src;
            var type = obj.type;

            if(type === 'projectReference') {
                project.removeProjectReference(path.join(plugin.dir, src), getTargetConditions(obj));
            }
            else {
                var targetPath = path.join('plugins', plugin.id);
                removeFile(project.root, targetPath);
                project.removeReference(src, getTargetConditions(obj));
            }
        }
    },
    asset:{
        install:function(obj, plugin, project, options) {
            if (!obj.src) {
                throw new CordovaError('<asset> tag without required "src" attribute. plugin=' + plugin.dir);
            }
            if (!obj.target) {
                throw new CordovaError('<asset> tag without required "target" attribute');
            }

            var www = options.usePlatformWww ? project.platformWww : project.www;
            copyFile(plugin.dir, obj.src, www, obj.target);
        },
        uninstall:function(obj, plugin, project, options) {
            var target = obj.target || obj.src;

            if (!target) throw new CordovaError('<asset> tag without required "target" attribute');

            var www = options.usePlatformWww ? project.platformWww : project.www;
            removeFile(www, target);
            shell.rm('-Rf', path.resolve(www, 'plugins', plugin.id));
        }
    },
    'js-module': {
        install: function (obj, plugin, project, options) {
            // Copy the plugin's files into the www directory.
            var moduleSource = path.resolve(plugin.dir, obj.src);
            var moduleName = plugin.id + '.' + (obj.name || path.parse(obj.src).name);

            // Read in the file, prepend the cordova.define, and write it back out.
            var scriptContent = fs.readFileSync(moduleSource, 'utf-8').replace(/^\ufeff/, ''); // Window BOM
            if (moduleSource.match(/.*\.json$/)) {
                scriptContent = 'module.exports = ' + scriptContent;
            }
            scriptContent = 'cordova.define("' + moduleName + '", function(require, exports, module) {\n' + scriptContent + '\n});\n';

            var www = options.usePlatformWww ? project.platformWww : project.www;
            var moduleDestination = path.resolve(www, 'plugins', plugin.id, obj.src);
            shell.mkdir('-p', path.dirname(moduleDestination));
            fs.writeFileSync(moduleDestination, scriptContent, 'utf-8');
        },
        uninstall: function (obj, plugin, project, options) {
            var pluginRelativePath = path.join('plugins', plugin.id, obj.src);
            var www = options.usePlatformWww ? project.platformWww : project.www;
            removeFileAndParents(www, pluginRelativePath);
        }
    }
};

// Helpers from common

module.exports.getInstaller = function (type) {
    if (handlers[type] && handlers[type].install) {
        return handlers[type].install;
    }

    events.emit('verbose', '<' + type + '> is not supported for Windows plugins');
};

module.exports.getUninstaller = function(type) {
    if (handlers[type] && handlers[type].uninstall) {
        return handlers[type].uninstall;
    }

    events.emit('verbose', '<' + type + '> is not supported for Windows plugins');
};

function getTargetConditions(obj) {
    return { versions: obj.versions, deviceTarget: obj.deviceTarget, arch: obj.arch };
}

function copyFile (plugin_dir, src, project_dir, dest, link) {
    src = path.resolve(plugin_dir, src);
    if (!fs.existsSync(src)) throw new CordovaError('"' + src + '" not found!');

    // check that src path is inside plugin directory
    var real_path = fs.realpathSync(src);
    var real_plugin_path = fs.realpathSync(plugin_dir);
    if (real_path.indexOf(real_plugin_path) !== 0)
        throw new CordovaError('"' + src + '" not located within plugin!');

    dest = path.resolve(project_dir, dest);

    // check that dest path is located in project directory
    if (dest.indexOf(project_dir) !== 0)
        throw new CordovaError('"' + dest + '" not located within project!');

    shell.mkdir('-p', path.dirname(dest));

    if (link) {
        fs.symlinkSync(path.relative(path.dirname(dest), src), dest);
    } else if (fs.statSync(src).isDirectory()) {
        // XXX shelljs decides to create a directory when -R|-r is used which sucks. http://goo.gl/nbsjq
        shell.cp('-Rf', src+'/*', dest);
    } else {
        shell.cp('-f', src, dest);
    }
}

// Same as copy file but throws error if target exists
function copyNewFile (plugin_dir, src, project_dir, dest, link) {
    var target_path = path.resolve(project_dir, dest);
    if (fs.existsSync(target_path))
        throw new CordovaError('"' + target_path + '" already exists!');

    copyFile(plugin_dir, src, project_dir, dest, !!link);
}

// checks if file exists and then deletes. Error if doesn't exist
function removeFile (project_dir, src) {
    var file = path.resolve(project_dir, src);
    shell.rm('-Rf', file);
}

function removeFileAndParents (baseDir, destFile, stopper) {
    stopper = stopper || '.';
    var file = path.resolve(baseDir, destFile);
    if (!fs.existsSync(file)) return;

    shell.rm('-rf', file);

    // check if directory is empty
    var curDir = path.dirname(file);

    while(curDir !== path.resolve(baseDir, stopper)) {
        if(fs.existsSync(curDir) && fs.readdirSync(curDir).length === 0) {
            fs.rmdirSync(curDir);
            curDir = path.resolve(curDir, '..');
        } else {
            // directory not empty...do nothing
            break;
        }
    }
}
