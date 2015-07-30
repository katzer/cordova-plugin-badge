cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/cordova-plugin-test-framework/www/tests.js",
        "id": "cordova-plugin-test-framework.cdvtests"
    },
    {
        "file": "plugins/cordova-plugin-test-framework/www/jasmine_helpers.js",
        "id": "cordova-plugin-test-framework.jasmine_helpers"
    },
    {
        "file": "plugins/cordova-plugin-test-framework/www/medic.js",
        "id": "cordova-plugin-test-framework.medic"
    },
    {
        "file": "plugins/cordova-plugin-test-framework/www/main.js",
        "id": "cordova-plugin-test-framework.main"
    },
    {
        "file": "plugins/de.appplant.cordova.plugin.badge/www/badge.js",
        "id": "de.appplant.cordova.plugin.badge.Badge",
        "clobbers": [
            "plugin.notification.badge",
            "cordova.plugins.notification.badge"
        ]
    },
    {
        "file": "plugins/de.appplant.cordova.plugin.badge/src/windows/BadgeProxy.js",
        "id": "de.appplant.cordova.plugin.badge.Badge.Proxy",
        "runs": true
    },
    {
        "file": "plugins/nl.x-services.plugins.toast/www/Toast.js",
        "id": "nl.x-services.plugins.toast.Toast",
        "clobbers": [
            "window.plugins.toast"
        ]
    },
    {
        "file": "plugins/nl.x-services.plugins.toast/test/tests.js",
        "id": "nl.x-services.plugins.toast.tests"
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-test-framework": "1.0.1",
    "de.appplant.cordova.common.registerusernotificationsettings": "1.0.1",
    "de.appplant.cordova.plugin.badge": "0.7.1dev",
    "nl.x-services.plugins.toast": "2.0.4"
}
// BOTTOM OF METADATA
});