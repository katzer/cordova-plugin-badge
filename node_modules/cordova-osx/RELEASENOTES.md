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
 
### 4.0.1 (Mar 03, 2016)
* updated .ratignore
* CB-10668 added node_modules directory
* CB-10668 removed bin/node_modules, updated create.js to use root node_modules
* CB-10668 updated package.json, prepare.js and Api.js
* CB-10646 Platform specific icons not copied to xcode project

### 4.0.0 (Feb 11, 2016)
* CB-10570 Compilation error on case sensitive filesystem
* CB-6789 **OSX** - Fix header licenses (Apache RAT report).
* Update `CDVBridge.m`
* CB-10308 Unable to parse multi dimensional arrays with more than 2 levels
* CB-10238 Move device-plugin out from `cordovalib` to the plugin repository
* CB-9818 Reloading the webview in **OSX** looses the `CordovaBridgeUti`
* CB-10198 Prompt submission bug
* CB-10085 Implement and expose PlatformApi for **OSX**
* CB-10099 **OSX** copy-paste not possible in own windows
* CB-10087 **OSX** facilitate easy preferences menu item handling
* CB-10084 **OSX** (re)move connectivity in favour of `cordova-plugin-network-information`
* CB-6789 **OSX** Fix header licenses 
* CB-9584 **OSX** add config to enable webview debug menu
* simple: `CDV.h` is not exported
* CB-9925 Add basic tests to **OSX** platform
* CB-9818 Reloading the webview in **OSX** looses the `CordovaBridgeUtil`
* CB-9692 **OSX** `cordova.exec` is not available
* CB-9581 **OSX** `WebView` does not send cookies is safari cache is cleared 
* Fullscreen windows does not properly get focused
* fix plugin argument calls
* CB-9541 Add preferences to put app into "kiosk mode"
* escape `__PROJECT_NAME__` with quotes in project file
* replace `__PROJECT_NAME__` also in `config.xml` and controller strings
* CB-9517 Adding a plugin on **iOS/OSX** that uses a private framework does not work 
* CB-8417 moved platform specific js into platform
* CB-6789 Add license to `CONTRIBUTING.md`
* Updated docs link in `README` to use apache link, not the redirect.
* CB-6567 Adding the **OSX** platform also copies over the `CordovaLibTests`
* CB-6560: added top level `package.json` file
* CB-6491 add `CONTRIBUTING.md`


### 3.5.0 (20140418) ###
* Fixed layout and updated scripts to work with cli

### 3.0.0 (20130718) ###

* [CB-3179] Change <plugin> to <feature> in config.xml and remove deprecation notice in OSX

### 2.9.0 (201306XX) ###

* [CB-3833] Deprecation plugin tag upgrade step has malformed xml
* [CB-3463] bin/create should copy cordova.js into the project's CordovaLib
* Added missing licenses after running Apache RAT

### 2.8.0 (201306XX) ###

* [CB-3171] Add deprecation notice for use of <plugin> in config.xml in OSX
* [CB-2200] Remove deprecated device.name field.
* [CB-3443] OSX - cordova-VERSION.js -> cordova.js

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
