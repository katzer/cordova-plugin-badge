/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */


function echoTests() {
    var payloads = {
        'string': "Hello, World",
        'empty-string': "",
        'one': 1,
        'zero': 0,
        'true': true,
        'false': false,
        'double': 3.141,
        'array': ['a','b','c'],
        'nested-array': ['a','b','c', [1,2,3]],
        'object': {a:'a', b:'b'},
        'nested-object': {a:'a', b:'b', c:{d:'d'}}
    };

    var tests = [];
    var numCompleted = 0;
    var numFailed = 0;
    function completed() {
        numCompleted++;
        if (numCompleted === tests.length) {
            window.jsTests.echo.result = numFailed === 0;
        }
    }

    var Test = function(name, payload) {
        this.payload = payload;
        this.name = name;
        this.result = '';
    };
    var _success = function(ret) {
        var result = JSON.stringify(ret);
        var expected = JSON.stringify(this.payload);
        if (result === expected) {
            console.log('success of ' + this.name);
            this.result = true;
        } else {
            console.log(this.name + ' failed. Expected ' + expected +' but got ' + result);
            this.result = false;
            numFailed++;
        }
        completed();
    };

    var _failure = function(e) {
        console.log('failure of ' + this.name);
        this.result = false;
        numFailed++;
        completed();
    };

    Test.prototype.run = function() {
        plugins.Test.echo(_success.bind(this), _failure.bind(this), this.payload);
    };


    for (var name in payloads) {
        var test = new Test(name, payloads[name]);
        tests.push(test);
        test.run();
    }
}

function runTests() {

    console.log('running tests...');
    echoTests();
    return 'echo';

}

window.jsTests = {

    echo: {
        result: ''
    }
};
