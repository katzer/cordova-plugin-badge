cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/de.appplant.cordova.plugin.badge/www/badge.js",
        "id": "de.appplant.cordova.plugin.badge.Badge",
        "clobbers": [
            "plugin.notification.badge",
            "cordova.plugins.notification.badge"
        ]
    },
    {
        "file": "plugins/de.appplant.cordova.plugin.badge/src/browser/favico.min.js",
        "id": "de.appplant.cordova.plugin.badge.Badge.Favico",
        "clobbers": [
            "cordova.plugins.notification.badge.Favico"
        ]
    },
    {
        "file": "plugins/de.appplant.cordova.plugin.badge/src/browser/BadgeProxy.js",
        "id": "de.appplant.cordova.plugin.badge.Badge.Proxy",
        "runs": true
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "de.appplant.cordova.common.registerusernotificationsettings": "1.0.1",
    "de.appplant.cordova.plugin.badge": "0.7.0dev"
}
// BOTTOM OF METADATA
});