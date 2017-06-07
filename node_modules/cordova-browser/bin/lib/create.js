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
 
var fs = require('fs'),
    shjs = require('shelljs'),
    Q = require ('q'),
    args = process.argv,
    path = require('path'),
    ROOT    = path.join(__dirname, '..', '..'),
    check_reqs = require('./check_reqs');

module.exports.createProject = function(project_path,package_name,project_name){
    
    var VERSION = fs.readFileSync(path.join(ROOT, 'VERSION'), 'utf-8');
    
    // Set default values for path, package and name
    project_path = typeof project_path !== 'undefined' ? project_path : "CordovaExample";

    // Check if project already exists
    if (fs.existsSync(project_path)) {
        console.error('Project already exists! Delete and recreate');
        process.exit(2);
    }
    
    // Check that requirements are met and proper targets are installed
    if (!check_reqs.run()) {
        console.error('Please make sure you meet the software requirements in order to build a browser cordova project');
        process.exit(2);
    }

    console.log('Creating Browser project. Path: ' + path.relative(process.cwd(),project_path));

    //copy template directory
    shjs.cp('-r', path.join(ROOT, 'bin', 'templates', 'project', 'www'), project_path);

    //create cordova/lib if it does not exist yet
    if (!fs.existsSync(path.join(project_path,'cordova', 'lib'))) {
        shjs.mkdir('-p', path.join(project_path,'cordova', 'lib'));
    }

    //copy required node_modules
    shjs.cp('-r', path.join(ROOT, 'node_modules'), path.join(project_path,'cordova'));

    //copy check_reqs file
    shjs.cp( path.join(ROOT, 'bin', 'lib', 'check_reqs.js'), path.join(project_path,'cordova', 'lib'));
    
    //copy cordova js file
    shjs.cp('-r', path.join(ROOT, 'cordova-lib', 'cordova.js'), path.join(project_path,'www'));

    //copy cordova-js-src directory
    shjs.cp('-rf', path.join(ROOT, 'cordova-js-src'), path.join(project_path, 'platform_www'));

    //copy cordova directory
    shjs.cp('-r', path.join(ROOT, 'bin', 'templates', 'project', 'cordova'), project_path); 
    [
        'run',
        'build',
        'clean',
        'version',
    ].forEach(function(f) { 
         shjs.chmod(755, path.join(project_path, 'cordova', f));
    });

    return Q.resolve();
};
