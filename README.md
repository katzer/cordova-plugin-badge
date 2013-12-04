Cordova Badge-Plugin
====================

A bunch of badge notification plugins for Cordova 3.x.x

by Sebastián Katzer ([github.com/katzer](https://github.com/katzer))

## Supported Platforms
- **iOS**
- **WP8**

## Adding the Plugin to your project
Through the [Command-line Interface](http://cordova.apache.org/docs/en/3.0.0/guide_cli_index.md.html#The%20Command-line%20Interface):
```
cordova plugin add https://github.com/katzer/cordova-plugin-badge.git
```

## Removing the Plugin from your project
Through the [Command-line Interface](http://cordova.apache.org/docs/en/3.0.0/guide_cli_index.md.html#The%20Command-line%20Interface):
```
cordova plugin rm de.appplant.cordova.plugin.badge
```

## Release Notes
#### Version 0.4.1 (not yet released)
- Release under the Apache 2.0 license.

#### Version 0.4.0 (07.10.2013)
- Added WP8 support
- **Note:** The former `plugin.badge` namespace is not longer available.

#### Version 0.2.1 (15.08.2013)
- Added new namespace `plugin.notification.badge`<br>
  **Note:** The former `plugin.badge` namespace is deprecated now and will be removed in the next major release.

#### Version 0.2.0 (11.08.2013)
- Added iOS support<br>
  *Based on the Badge iOS plugin made by* ***Joseph Stuhr***

## Using the plugin
The plugin creates the object ```window.plugin.notification.badge``` with two methods:

### set()
To set the badge number:
```javascript
window.plugin.notification.badge.set(_number_);
```

### clear()
To clear the badge:
```javascript
window.plugin.notification.badge.clear();
window.plugin.notification.badge.set(0);  // alternative
```

####  Example
To set the badge number to **1**:
```javascript
window.plugin.notification.badge.set(1);
// or
window.plugin.notification.badge.set('1');
```

## Quirks
### TypeError: Cannot read property 'currentVersion' of null
Along with Cordova 3.2 and Windows Phone 8 the `version.bat` script has to be renamed to `version`.

On Mac or Linux
```
mv platforms/wp8/cordova/version.bat platforms/wp8/cordova/version
```
On Windows
```
ren platforms\wp8\cordova\version.bat platforms\wp8\cordova\version
```

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request

## License

This software is released under the [Apache 2.0 License](http://opensource.org/licenses/Apache-2.0).
