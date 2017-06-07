cordova.define("cordova-plugin-badge.Badge.Proxy", function(require, exports, module) {
/*
 * This file contains Original Code and/or Modifications of Original Code
 * as defined in and that are subject to the Apache License
 * Version 2.0 (the 'License'). You may not use this file except in
 * compliance with the License. Please obtain a copy of the License at
 * http://opensource.org/licenses/Apache-2.0/ and read it before using this
 * file.
 *
 * The Original Code and all software distributed under the License are
 * distributed on an 'AS IS' basis, WITHOUT WARRANTY OF ANY KIND, EITHER
 * EXPRESS OR IMPLIED, AND APPLE HEREBY DISCLAIMS ALL SUCH WARRANTIES,
 * INCLUDING WITHOUT LIMITATION, ANY WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE, QUIET ENJOYMENT OR NON-INFRINGEMENT.
 * Please see the License for the specific language governing rights and
 * limitations under the License.
 */

/**
 * Clear the badge number.
 *
 * @param [ Function ] success Success callback
 * @param [ Function ] error   Error callback
 *
 * @return [ Void ]
 */
exports.clear = function (success, error) {
    exports.setBadge(success, error, [0]);
};

/**
 * Get the badge number.
 *
 * @param [ Function ] success Success callback
 * @param [ Function ] error   Error callback
 *
 * @return [ Void ]
 */
exports.get = function (success, error) {
    var app  = WinJS.Application,
        file = exports._cordova_badge_number;

    app.local.exists(file).then(function (exists) {
        if (exists) {
            app.local.readText(file).then(function (badge) {
                success(isNaN(badge) ? badge : Number(badge));
            });
        } else {
            success(0);
        }
    });
};

/**
 * Set the badge number.
 *
 * @param [ Function ] success Success callback
 * @param [ Function ] error   Error callback
 * @param [ Int ]      badge   The badge number
 *
 * @return [ Void ]
 */
exports.set = function (success, error, args) {
    var notifications = Windows.UI.Notifications,
        badge         = args[0],
        type          = notifications.BadgeTemplateType.badgeNumber,
        xml           = notifications.BadgeUpdateManager.getTemplateContent(type),
        attrs         = xml.getElementsByTagName('badge'),
        notification  = new notifications.BadgeNotification(xml);

    attrs[0].setAttribute('value', badge);

    notifications.BadgeUpdateManager
        .createBadgeUpdaterForApplication()
        .update(notification);

    exports._saveBadge(badge);

    success(badge);
};

/**
 * Path to file that containes the badge number.
 */
exports._cordova_badge_number = 'cordova_badge_number';

/**
 * Persist the badge of the app icon so that `getBadge` is able to return the
 * badge number back to the client.
 *
 * @param [ Int ] badge The badge number
 *
 * @return [ Void ]
 */
exports._saveBadge = function (badge) {
    WinJS.Application.local.writeText(exports._cordova_badge_number, badge);
};

cordova.commandProxy.add('Badge', exports);

});
