Cordova Badge-Plugin
====================

[Cordova][cordova] plugin to access and modify the badge of the app icon.


## Supported Platforms
- **iOS**
- **Android** *(SDK >=11)*<br>
See [Notification Guide][android_notification_guide] for detailed informations and screenshots.
- **WP8**<br>
See [WP8 Guide][wp8_notification_guide] for detailed informations and screenshots.


## Installation
The plugin can either be installed into the local development environment or cloud based through [PhoneGap Build][PGB].

### Adding the Plugin to your project
Through the [Command-line Interface][CLI]:
```bash
# ~~ from master ~~
cordova plugin add https://github.com/katzer/cordova-plugin-badge.git && cordova prepare
```
or to use the last stable version:
```bash
# ~~ stable version ~~
cordova plugin add de.appplant.cordova.plugin.badge && cordova prepare
```

### Removing the Plugin from your project
Through the [Command-line Interface][CLI]:
```bash
cordova plugin rm de.appplant.cordova.plugin.badge
```

### PhoneGap Build
Add the following xml to your config.xml to always use the latest version of this plugin:
```xml
<gap:plugin name="de.appplant.cordova.plugin.badge" />
```
or to use an specific version:
```xml
<gap:plugin name="de.appplant.cordova.plugin.badge" version="0.5.1" />
```
More informations can be found [here][PGB_plugin].


## Using the plugin
The plugin creates the object ```window.plugin.badge``` with the following interface:

### Plugin initialization
The plugin and its methods are not available before the *deviceready* event has been fired.

```javascript
document.addEventListener('deviceready', function () {
    // window.plugin.badge is now available
}, false);
```

### Set the badge of the app icon
The badge of the app can be set through the `badge.set` interface.<br>
The method takes the badge as its argument. It needs to be a number or a string which can be parsed to a number.

#### Further informations
- On Android the badge will be displayed through a notification. See [setTitle][set_title] how to specify a custom notification title.
- On Windows Phone 8 the badge will be displayed through the app's live tile.
- See [clear][clear] of how to clear the badge of the app icon.
- See the [examples][examples] of how to use the plugin.

```javascript
window.plugin.notification.badge.set(Number);
```

### Clear the badge of the app icon
The badge of the app can be removed through the `badge.clear` interface.

#### Further informations
- Clearing the badge number is equivalent to set a zero number.
- See [set][set] of how to set the badge of the app icon.

```javascript
window.plugin.notification.badge.clear();
```


##  Examples
### Set the badge of the app icon
The following example shows how to set the badge of the app icon to **1**.

```javascript
window.plugin.notification.badge.set(1);
// or
window.plugin.notification.badge.set('1');
```

### Clear the badge of the app icon
See below how to clear the badge of the app icon.

```javascript
window.plugin.notification.badge.clear();
// or
window.plugin.notification.badge.set(0);
```


## Platform specifics
### Specify custom notification title on Android
The default format for the title is `%d new messages`, but is customizable through `setTitle`.

```javascript
window.plugin.notification.badge.setTitle('%d neue Meldungen');
```

## Quirks
### TypeError: Cannot read property 'currentVersion' of null
The `version.bat` script can to be renamed to `version` as a workaround.

On Mac or Linux
```
mv platforms/wp8/cordova/version.bat platforms/wp8/cordova/version
```
On Windows
```
ren platforms\wp8\cordova\version.bat platforms\wp8\cordova\version
```

### App restarts on Android after notification was clicked
Try setting the launch mode for the main activity to `singleInstance`
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

This software is released under the [Apache 2.0 License][apache2_license].

© 2013-2014 appPlant UG, Inc. All rights reserved


[cordova]: https://cordova.apache.org
[android_notification_guide]: http://developer.android.com/guide/topics/ui/notifiers/notifications.html
[wp8_notification_guide]: http://msdn.microsoft.com/en-us/library/windowsphone/develop/hh202948.aspx
[CLI]: http://cordova.apache.org/docs/en/3.0.0/guide_cli_index.md.html#The%20Command-line%20Interface
[PGB]: http://docs.build.phonegap.com/en_US/3.3.0/index.html
[PGB_plugin]: https://build.phonegap.com/plugins/416
[set]: #set_the_badge_of_the_app_icon
[clear]: #clear_the_badge_of_the_app_icon
[examples]: #examples
[set_title]: specify_custom_notification_title_on_android

[apache2_license]: http://opensource.org/licenses/Apache-2.0
