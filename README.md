Cordova Badge-Plugin
====================

A bunch of badge number plugins for Cordova 3.x.x

by Sebastián Katzer ([github.com/katzer](https://github.com/katzer))

## Supported Platforms
- **iOS**
- **WP8**
- **Android** *(SDK >=11)*<br>
See [Notification Guide](http://developer.android.com/guide/topics/ui/notifiers/notifications.html) for detailed informations and screenshots.

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

## PhoneGap Build
Add the following xml to your config.xml to always use the latest version of this plugin:
```
<gap:plugin name="de.appplant.cordova.plugin.badge" />
```
or to use this exact version:
```
<gap:plugin name="de.appplant.cordova.plugin.badge" version="0.5.0" />
```
More informations can be found [here](https://build.phonegap.com/plugins/384).

## Release Notes
#### Version 0.5.1 (25.01.2014)
- [enhancement:] Specify custom notification title on Android can be set through JS interface.
- [enhancement:] Setting launchMode to *singleInstance* isn't necessary anymore. App does not restart on click anymore.

#### Version 0.5.0 (04.01.2014)
- Added Android support

#### Version 0.4.1 (04.12.2013)
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
The method takes the badge number as an argument. The argument needs to be a number or a string which can be parsed to a number.
```javascript
window.plugin.notification.badge.set(Number);
```

### clear()
Clearing the badge number is equivalent to set a zero number.
```javascript
window.plugin.notification.badge.clear();
// or
window.plugin.notification.badge.set(0);
```

##  Example
Sets the badge number to **1**:
```javascript
window.plugin.notification.badge.set(1);
// or
window.plugin.notification.badge.set('1');
```

## Platform specifics
### Specify custom notification title on Android
The default format for the title is `%d new messages`. But it can be customized through `setTitle`.
```javascript
window.plugin.notification.badge.setTitle('%d neue Meldungen');
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

### App restarts on Android after notification was clicked
The launch mode for the main activity has to be set to `singleInstance`
```xml
<activity ... android:launchMode="singleInstance" ... />
```


## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request

## License

This software is released under the [Apache 2.0 License](http://opensource.org/licenses/Apache-2.0).
