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
Cordova OSX
=============================================================
CordovaLib is a framework that enables users to include Cordova in their OS X application projects easily, 
and also create new Cordova based OS X application projects.

Note that the current focus of this cordova platform is to provide kiosk-like applications for OSX, that usually run fullscreen and have little desktop interaction. So there is no direct support for menus, dock integration, finder integration, documents, etc. Think of it as a mobile app running on a very big screen.

Pre-requisites
-------------------------------------------------------------
Make sure you have installed the latest released OS X SDK which comes with Xcode 6 or later. 
Download it at [http://developer.apple.com/downloads](http://developer.apple.com/downloads) 
or the [Mac App Store](http://itunes.apple.com/us/app/xcode/id497799835?mt=12).


Create your project
-------------------------------------------------------------
   
1. (Optionally) Follow the instructions in the [**Command-Line Usage**](http://cordova.apache.org/docs/en/latest/guide/cli/index.html) section of the [Cordova Docs](http://cordova.apache.org/docs/en/latest/guide/cli/index.html) to create a new project. For example

   ````
   $ cordova create hello com.example.hello HelloWorld
   ````

2. add the osx platform:

   ````
   $ cordova platform add osx
   $ cordova run osx
   ````
   
3. You can also open the project in XCode:

   ````
   $ open platforms/osx/<yourproject>.xcodeproj
   ````


### Add plugins

1. for example, if you need the file-plugin do:

   ````
   $ cordova plugin add cordova-plugin-file
   ````
    

Create a Cordova OSX Standalone project
-------------------------------------------------------------

1. Download the source
2. execute the `create` command to setup an empty project:

   ````
   $ bin/create <path_to_new_project> <package_name> <project_name>
   ````
    
   for example
    
   ````
   $ bin/create ../Foo org.apache.foo FooBar
   ````

### Add plugins

1. for example, if you need the file-plugin do:

   ````
   $ cordova plugin add cordova-plugin-file
   ````


Updating a CordovaLib subproject reference in your project
-------------------------------------------------------------

When you update to a new Cordova version, you may need to update the CordovaLib reference in an existing project. 
Cordova comes with a script that will help you to do this.

1. Launch **Terminal.app**
2. Go to the location where you installed Cordova, in the `bin` sub-folder
3. Run `update /path/to/your/project` 



FAQ
---
### How do debug the webview?
You need to enable the `WebDeveloperExtras` for your bundle:

```
defaults write com.yourcompany.yourbundleid WebKitDeveloperExtras -bool true
```
After you changed the defatuls, start the application and right-click inside the webview and select _Inspect Element_. This opens the Safari Developer Tools.

> **Note**: The _bundleid_ is usually the same as your _widget id_ you define in your `config.xml` unless overridden by the `ios-CFBundleVersion` argument.



BUGS?
-----
File them at the [Cordova Issue Tracker](https://issues.apache.org/jira/browse/CB)     


MORE INFO
----------
* [http://cordova.apache.org/](http://cordova.apache.org/)

