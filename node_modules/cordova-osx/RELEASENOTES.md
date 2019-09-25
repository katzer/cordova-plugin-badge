<!--
#
# Licensed to the Apache Software Foundation (ASF) under one
# or more contributor license agreements.  See the NOTICE file
# distributed with this work for additional information
# regarding copyright ownership.  The ASF licenses this file
# to you under the Apache License, Version 2.0 (the
# "License"); you may not use this file except in compliance
# with the License.  You may obtain a copy of the License at
# 
# http://www.apache.org/licenses/LICENSE-2.0
# 
# Unless required by applicable law or agreed to in writing,
# software distributed under the License is distributed on an
# "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
#  KIND, either express or implied.  See the License for the
# specific language governing permissions and limitations
# under the License.
#
-->
## Release Notes for Cordova (OS X) ##
 
### 5.0.0 (Feb 01, 2019)
* [GH-83](https://github.com/apache/cordova-osx/pull/83) OSX Platform Release Preparation (Cordova 9)
* [GH-66](https://github.com/apache/cordova-osx/pull/66) explicit `plist@3` dependency
* [GH-82](https://github.com/apache/cordova-osx/pull/82) Copy `node_modules` if the directory exists
* [GH-75](https://github.com/apache/cordova-osx/pull/75) Move `jasmine-spec-reporter` to `devDependencies`
* [GH-73](https://github.com/apache/cordova-osx/pull/73) More verbose test reporter
* [GH-69](https://github.com/apache/cordova-osx/pull/69) Dependency bump `cordova-common@^3.0.0`
* [GH-67](https://github.com/apache/cordova-osx/pull/67) Test Framework Implementation Improvements
* [GH-62](https://github.com/apache/cordova-osx/pull/62) Remove Unused Dependencies & update tmp
* [GH-63](https://github.com/apache/cordova-osx/pull/63) Remove `.jshintrc` from tests
* [GH-61](https://github.com/apache/cordova-osx/pull/61) ESLint Dependencies Update, Configure and Corrections
* [GH-59](https://github.com/apache/cordova-osx/pull/59) Added Travis CI OSX Image and Install `cordova@latest`
* [GH-60](https://github.com/apache/cordova-osx/pull/60) Updated License with a Valid SPDX License
* [GH-56](https://github.com/apache/cordova-osx/pull/56) Test Framework Consistency
* [GH-54](https://github.com/apache/cordova-osx/pull/54) Remove Bundled Dependencies
* [GH-53](https://github.com/apache/cordova-osx/pull/53) Add Node 10 & Drop Node 4 Support
* [CB-13449](https://issues.apache.org/jira/browse/CB-13449) Assign 1024x1024 app icon
* [CB-3021](https://issues.apache.org/jira/browse/CB-3021) Can no longer import CDVPlugin.h from plugin Objective-C++ code
* [CB-13824](https://issues.apache.org/jira/browse/CB-13824) Swift 4 support
* [CB-13825](https://issues.apache.org/jira/browse/CB-13825) Update Node Dependencies
* [CB-13424](https://issues.apache.org/jira/browse/CB-13424) Replaces undefined `self` with `this`
* [CB-13424](https://issues.apache.org/jira/browse/CB-13424) When running `cordova plugin add/remove` plugins are added and removed properly to the osx platform `config.xml` file
* [CB-13449](https://issues.apache.org/jira/browse/CB-13449) Added support for 1024x1024 app icon
* [CB-13304](https://issues.apache.org/jira/browse/CB-13304) expose preference to control WebView navigation
* [CB-12339](https://issues.apache.org/jira/browse/CB-12339) handle re-open app window
* [CB-12985](https://issues.apache.org/jira/browse/CB-12985) updated to use eslint format
* [CB-12762](https://issues.apache.org/jira/browse/CB-12762) point `package.json` repo items to github mirrors instead of apache repos site
* [CB-11948](https://issues.apache.org/jira/browse/CB-11948) Modal dialog (window.confirm) opens behind fullscreen window and cannot be closed
* [CB-11510](https://issues.apache.org/jira/browse/CB-11510) OSX app doesn't properly span all vertical displays
* [CB-9918](https://issues.apache.org/jira/browse/CB-9918) CDVInvokedUrlCommand.argumentAtIndex returns WebUndefined instead of nil
* [CB-11002](https://issues.apache.org/jira/browse/CB-11002) Enable hidden accelerated rendering settings by default
* [CB-10668](https://issues.apache.org/jira/browse/CB-10668) fixed failing tests, reverted shelljs to 0.5.3

### 4.0.1 (Mar 03, 2016)
* updated .ratignore
* [CB-10668](https://issues.apache.org/jira/browse/CB-10668) added node_modules directory
* [CB-10668](https://issues.apache.org/jira/browse/CB-10668) removed bin/node_modules, updated create.js to use root node_modules
* [CB-10668](https://issues.apache.org/jira/browse/CB-10668) updated package.json, prepare.js and Api.js
* [CB-10646](https://issues.apache.org/jira/browse/CB-10646) Platform specific icons not copied to xcode project

### 4.0.0 (Feb 11, 2016)
* [CB-10570](https://issues.apache.org/jira/browse/CB-10570) Compilation error on case sensitive filesystem
* [CB-6789](https://issues.apache.org/jira/browse/CB-6789) **OSX** - Fix header licenses (Apache RAT report).
* Update `CDVBridge.m`
* [CB-10308](https://issues.apache.org/jira/browse/CB-10308) Unable to parse multi dimensional arrays with more than 2 levels
* [CB-10238](https://issues.apache.org/jira/browse/CB-10238) Move device-plugin out from `cordovalib` to the plugin repository
* [CB-9818](https://issues.apache.org/jira/browse/CB-9818) Reloading the webview in **OSX** looses the `CordovaBridgeUti`
* [CB-10198](https://issues.apache.org/jira/browse/CB-10198) Prompt submission bug
* [CB-10085](https://issues.apache.org/jira/browse/CB-10085) Implement and expose PlatformApi for **OSX**
* [CB-10099](https://issues.apache.org/jira/browse/CB-10099) **OSX** copy-paste not possible in own windows
* [CB-10087](https://issues.apache.org/jira/browse/CB-10087) **OSX** facilitate easy preferences menu item handling
* [CB-10084](https://issues.apache.org/jira/browse/CB-10084) **OSX** (re)move connectivity in favour of `cordova-plugin-network-information`
* [CB-6789](https://issues.apache.org/jira/browse/CB-6789) **OSX** Fix header licenses 
* [CB-9584](https://issues.apache.org/jira/browse/CB-9584) **OSX** add config to enable webview debug menu
* simple: `CDV.h` is not exported
* [CB-9925](https://issues.apache.org/jira/browse/CB-9925) Add basic tests to **OSX** platform
* [CB-9818](https://issues.apache.org/jira/browse/CB-9818) Reloading the webview in **OSX** looses the `CordovaBridgeUtil`
* [CB-9692](https://issues.apache.org/jira/browse/CB-9692) **OSX** `cordova.exec` is not available
* [CB-9581](https://issues.apache.org/jira/browse/CB-9581) **OSX** `WebView` does not send cookies is safari cache is cleared 
* Fullscreen windows does not properly get focused
* fix plugin argument calls
* [CB-9541](https://issues.apache.org/jira/browse/CB-9541) Add preferences to put app into "kiosk mode"
* escape `__PROJECT_NAME__` with quotes in project file
* replace `__PROJECT_NAME__` also in `config.xml` and controller strings
* [CB-9517](https://issues.apache.org/jira/browse/CB-9517) Adding a plugin on **iOS/OSX** that uses a private framework does not work 
* [CB-8417](https://issues.apache.org/jira/browse/CB-8417) moved platform specific js into platform
* [CB-6789](https://issues.apache.org/jira/browse/CB-6789) Add license to `CONTRIBUTING.md`
* Updated docs link in `README` to use apache link, not the redirect.
* [CB-6567](https://issues.apache.org/jira/browse/CB-6567) Adding the **OSX** platform also copies over the `CordovaLibTests`
* [CB-6560](https://issues.apache.org/jira/browse/CB-6560) added top level `package.json` file
* [CB-6491](https://issues.apache.org/jira/browse/CB-6491) add `CONTRIBUTING.md`


### 3.5.0 (20140418) ###
* Fixed layout and updated scripts to work with cli

### 3.0.0 (20130718) ###

* [CB-3179](https://issues.apache.org/jira/browse/CB-3179) Change <plugin> to <feature> in config.xml and remove deprecation notice in OSX

### 2.9.0 (201306XX) ###

* [CB-3833](https://issues.apache.org/jira/browse/CB-3833) Deprecation plugin tag upgrade step has malformed xml
* [CB-3463](https://issues.apache.org/jira/browse/CB-3463) bin/create should copy cordova.js into the project's CordovaLib
* Added missing licenses after running Apache RAT

### 2.8.0 (201306XX) ###

* [CB-3171](https://issues.apache.org/jira/browse/CB-3171) Add deprecation notice for use of <plugin> in config.xml in OSX
* [CB-2200](https://issues.apache.org/jira/browse/CB-2200) Remove deprecated device.name field.
* [CB-3443](https://issues.apache.org/jira/browse/CB-3443) OSX - cordova-VERSION.js -> cordova.js

### 2.7.0 (20130501) ###

* Added ShellUtils for plugins to use.
* Support window.alert, window.prompt, window.confirm
* Enable HTML5 localStorage.
* Enable WebGL support through "EnableWebGL" preference (disabled by default)

<br />

### 2.6.0 (20130401) ###
* Initial release
* Supports third-party plugins (Plugin Development model is the same as iOS)
* Only two core plugins are supported currently (Device and NetworkStatus)
* White-listing is NOT supported yet
<br />
