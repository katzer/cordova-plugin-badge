cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "id": "cordova-plugin-x-toast.Toast",
        "file": "plugins/cordova-plugin-x-toast/www/Toast.js",
        "pluginId": "cordova-plugin-x-toast",
        "clobbers": [
            "window.plugins.toast"
        ]
    },
    {
        "id": "cordova-plugin-x-toast.tests",
        "file": "plugins/cordova-plugin-x-toast/test/tests.js",
        "pluginId": "cordova-plugin-x-toast"
    },
    {
        "id": "cordova-plugin-x-toast.ToastProxy",
        "file": "plugins/cordova-plugin-x-toast/src/windows/toastProxy.js",
        "pluginId": "cordova-plugin-x-toast",
        "merges": [
            ""
        ]
    },
    {
        "id": "cordova-plugin-badge.Badge",
        "file": "plugins/cordova-plugin-badge/www/badge.js",
        "pluginId": "cordova-plugin-badge",
        "clobbers": [
            "cordova.plugins.notification.badge"
        ]
    },
    {
        "id": "cordova-plugin-badge.Badge.Proxy",
        "file": "plugins/cordova-plugin-badge/src/windows/BadgeProxy.js",
        "pluginId": "cordova-plugin-badge",
        "runs": true
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-x-toast": "2.6.0",
    "cordova-plugin-badge": "0.8.4"
};
// BOTTOM OF METADATA
});