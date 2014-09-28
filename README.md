
Cordova Badge Plugin - Example
==============================

[Cordova][cordova] plugin to access and modify the badge number of the app icon on various mobile platforms including iOS, Android and Windows Phone.

## Instructions
[Download][zip] the _example_ branch and run the following command:

```bash
cordova run [ios|android|wp8]
```

These will lunch the simulator or any plugged in device and start the example application as seen below in the screenshots. Its also possible to open the project with [Android Studio][studio] or [Eclipse][eclipse].

<p align="center">
    <img src="images/overview.tiff"></img>
</p>

A click on the _"Set 10 as badge number"_ button will display the badge number on the home screen or notification center on Android.

```javascript
cordova.plugins.notification.badge.set(10);
```

Please read the plugin's [README][readme] for further requirements and informations.

### iOS8 Permissions
Since iOS8 to use of badge noficiations the user has to grant the permission before trying to set a badge number. Use the _"Prompt for permission"_ to prompt the use to grant the permission. Note that the OS will only prompt the user only once! Later the user needs to configure the settings manually.

<p align="center">
    <img src="images/permission.tiff"></img>
</p>


## Screenshots

<p align="center">
    <img height="270px" src="images/wp8.png"></img>
    &nbsp;
    <img height="270px" src="images/android.tiff"></img>
</p>
<p align="center">
    <img height="165px" src="images/ios.tiff"></img>
</p>


## License

This software is released under the [Apache 2.0 License][apache2_license].

© 2013-2014 appPlant UG, Inc. All rights reserved


[cordova]: https://cordova.apache.org
[readme]: https://github.com/katzer/cordova-plugin-badge/blob/master/README.md
[zip]: https://github.com/katzer/cordova-plugin-badge/archive/master.zip
[studio]: https://developer.android.com/sdk/installing/studio.html
[eclipse]: https://developer.android.com/sdk/index.html
[apache2_license]: http://opensource.org/licenses/Apache-2.0
