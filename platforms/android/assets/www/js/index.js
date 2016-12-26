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
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        document.getElementById('check').onclick = app.check;
        document.getElementById('grant').onclick = app.grant;
        document.getElementById('clear').onclick = app.clear;
        document.getElementById('inc').onclick   = app.inc;
        document.getElementById('dec').onclick   = app.dec;
        document.getElementById('get').onclick   = app.get;
        document.getElementById('fix').onclick   = app.fix;
        document.getElementById('rand').onclick  = app.rand;
        document.getElementById('toggle').onclick  = app.toggle;
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },
    // Check for permission
    check: function () {
        cordova.plugins.notification.badge.hasPermission(alert);
    },
    // Grant permission
    grant: function () {
        cordova.plugins.notification.badge.registerPermission(alert);
    },
    // Clear badge
    clear: function () {
        cordova.plugins.notification.badge.clear(alert);
    },
    // Increase badge by 1
    inc: function () {
        cordova.plugins.notification.badge.increase(1, alert);
    },
    // Decrease badge by 1
    dec: function () {
        cordova.plugins.notification.badge.decrease(1, alert);
    },
    // Get badge number
    get: function () {
        cordova.plugins.notification.badge.get(alert);
    },
    // Set fix badge number
    fix: function () {
        cordova.plugins.notification.badge.set(10, alert);
    },
    // Set rand badge number
    rand: function () {
        var num = Math.round(Math.random()*100);
        cordova.plugins.notification.badge.set(num, alert);
    },
    // Toggle autoclear flag
    toggle: function () {
        var config = cordova.plugins.notification.badge._config;

        cordova.plugins.notification.badge.configure({
            autoClear: !config.autoClear
        });

        alert('Set autoClear to \n' + config.autoClear);
    }

};

alert = function(msg) { window.plugins.toast.showShortBottom(String(msg)); };

if (window.hasOwnProperty('Windows')) {
    dialog = null;

    alert = function(msg) {
        if (dialog) {
            dialog.content = msg;
            return;
        }

        dialog = new Windows.UI.Popups.MessageDialog(msg);

        dialog.showAsync().done(function () {
            dialog = null;
        });
    };
}

app.initialize();
