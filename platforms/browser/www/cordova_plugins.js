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
    "cordova-plugin-test-framework": "1.0.1",
    "de.appplant.cordova.common.registerusernotificationsettings": "1.0.1",
    "de.appplant.cordova.plugin.badge": "0.7.1dev"
}
// BOTTOM OF METADATA
});