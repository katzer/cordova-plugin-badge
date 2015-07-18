cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
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
    "de.appplant.cordova.common.registerusernotificationsettings": "1.0.1",
    "nl.x-services.plugins.toast": "2.0.4"
}
// BOTTOM OF METADATA
});