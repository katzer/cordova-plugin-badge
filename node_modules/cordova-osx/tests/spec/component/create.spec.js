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

const shell = require('shelljs');
const path = require('path');
const util = require('util');
const fs = require('fs');
const tmp = require('tmp').dirSync().name;

const cordova_bin = path.join(__dirname, '../../..', 'bin');

function initProjectPath (projectname) {
    // remove existing folder
    const pPath = path.join(tmp, projectname);
    shell.rm('-rf', pPath);
    return pPath;
}

function createProject (projectname, projectid) {
    const projectPath = initProjectPath(projectname);

    // create the project
    const command = util.format('"%s/create" "%s/%s" %s "%s"', cordova_bin, tmp, projectname, projectid, projectname);
    shell.echo(command);

    const return_code = shell.exec(command).code;
    expect(return_code).toBe(0);
    expect(fs.existsSync(projectPath)).toBe(true);

    console.log('created project at %s', projectPath);
    return projectPath;
}

function createAndBuild (projectname, projectid) {
    const projectPath = createProject(projectname, projectid);

    // build the project
    const command = util.format('"%s/cordova/build"', path.join(tmp, projectname));
    shell.echo(command);

    const return_code = shell.exec(command, { silent: true }).code;
    expect(return_code).toBe(0);

    // clean-up
    shell.rm('-rf', projectPath);
}

describe('create', () => {
    it('create project with ascii+unicode name, and spaces', () => {
        const projectname = '応応応応 hello 用用用用';
        const projectid = 'com.test.app6';

        createAndBuild(projectname, projectid);
    });
});
