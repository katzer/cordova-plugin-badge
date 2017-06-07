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

var shell = require('shelljs'),
    spec = __dirname,
    path = require('path'),
    util = require('util'),
    fs = require('fs');

    var cordova_bin = path.join(spec, '../..', 'bin');
    var tmp = require('tmp').dirSync().name;

function initProjectPath(projectname) {
    // remove existing folder
    var pPath = path.join(tmp, projectname);
    shell.rm('-rf', pPath);
    return pPath;
}

function createProject(projectname, projectid) {
    var projectPath = initProjectPath(projectname);

    // create the project
    var command = util.format('"%s/create" "%s/%s" %s "%s"', cordova_bin, tmp, projectname, projectid, projectname);
    shell.echo(command);
    var return_code = shell.exec(command).code;
    expect(return_code).toBe(0);
    expect(fs.existsSync(projectPath)).toBe(true);

    console.log('created project at %s', projectPath);
    return projectPath;
}

function createAndBuild(projectname, projectid) {
    var projectPath = createProject(projectname, projectid);

    // build the project
    var command = util.format('"%s/cordova/build"', path.join(tmp, projectname));
    shell.echo(command);
    var return_code = shell.exec(command, { silent: true }).code;
    expect(return_code).toBe(0);

    // clean-up
    shell.rm('-rf', projectPath);
}

describe('create', function() {

    it('create project with ascii+unicode name, and spaces', function() {
        var projectname = '応応応応 hello 用用用用';
        var projectid = 'com.test.app6';

        createAndBuild(projectname, projectid);
    });

});
