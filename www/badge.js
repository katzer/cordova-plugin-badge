/**
 *  badge.js
 *  Cordova Badge Plugin
 *
 *  Created by Sebastian Katzer (github.com/katzer) on 10/08/2013.
 *  Copyright 2013 Sebastian Katzer. All rights reserved.
 *  GPL v2 licensed
 */

var Badge = function () {

};

Badge.prototype = {
    /**
     * Entfernt den Badge vom App Icon.
     */
    clear: function () {
        cordova.exec(null, null, 'Badge', 'setBadge', [0]);
    },

    /**
     * Fügt dem App Icon einen Badge hinzu.
     *
     * @param {Number} badge
     */
    set: function (badge) {
        cordova.exec(null, null, 'Badge', 'setBadge', [parseInt(badge) || 0]);
    }
};

var plugin = new Badge();

module.exports = plugin;