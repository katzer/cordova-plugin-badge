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
const tmp = require('tmp');

const tests_dir = path.join(__dirname, '..', '..');

describe('cordova-lib', () => {
    it('objective-c unit tests', () => {
        const artifacts_dir = tmp.dirSync().name;

        // run the tests
        const command = util.format('xcodebuild test ' +
                '-project %s/CordovaLibTests/CordovaLibTests.xcodeproj ' +
                '-scheme CordovaLibApp ' +
                'CONFIGURATION_BUILD_DIR="%s"', tests_dir, artifacts_dir);
        shell.echo(command);

        const return_code = shell.exec(command).code;
        expect(return_code).toBe(0);
    });
});
