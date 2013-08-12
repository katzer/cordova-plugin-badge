Cordova Badge-Plugin
====================

A bunch of badge plugins for Cordova 3.x.x

by Sebastián Katzer ([github.com/katzer](https://github.com/katzer))

## Supported Platforms ##
- **iOS**

## Adding the Plugin to your project ##
Through the [Command-line Interface](http://cordova.apache.org/docs/en/3.0.0/guide_cli_index.md.html#The%20Command-line%20Interface):
```
cordova plugin add https://github.com/katzer/cordova-plugin-badge.git
```

## Release Notes ##
#### Version 0.2.0 (11.08.2013) ####
- Added iOS support<br>
  *Based on the Badge iOS plugin made by* ***Joseph Stuhr***

## Using the plugin ##
The plugin creates the object ```window.plugin.badge``` with two methods:

### set() ###
To set the badge number:
```javascript
window.plugin.badge.set(_number_);
```

### clear() ###
To clear the badge:
```javascript
window.plugin.badge.clear();
window.plugin.badge.set(0); // alternative
```

####  Example ####
To set the badge number to **1**:
```javascript
window.plugin.badge.set(1);
```
