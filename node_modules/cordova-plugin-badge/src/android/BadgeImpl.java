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

package de.appplant.cordova.plugin.badge;

import android.content.Context;
import android.content.SharedPreferences;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import me.leolin.shortcutbadger.ShortcutBadger;

/**
 * Implementation of the badge interface methods.
 */
class BadgeImpl {

    // The name for the shared preferences key
    private static final String BADGE_KEY = "badge";

    // The name for the shared preferences key
    private static final String CONFIG_KEY = "badge.config";

    /**
     * Clear the badge number.
     *
     * @param ctx The application context.
     */
    void clearBadge (Context ctx) {
        saveBadge(0, ctx);
        ShortcutBadger.removeCount(ctx);
    }

    /**
     * Get the badge number.
     *
     * @param ctx      The application context.
     * @param callback The function to be exec as the callback.
     */
    void getBadge (CallbackContext callback, Context ctx) {
        SharedPreferences settings = getSharedPreferences(ctx);
        int badge = settings.getInt(BADGE_KEY, 0);
        PluginResult result;

        result = new PluginResult(PluginResult.Status.OK, badge);

        callback.sendPluginResult(result);
    }

    /**
     * Set the badge number.
     *
     * @param args The number to set as the badge number.
     * @param ctx  The application context
     */
    void setBadge (JSONArray args, Context ctx) {
        int badge = args.optInt(0);

        saveBadge(badge, ctx);
        ShortcutBadger.applyCount(ctx, badge);
    }

    /**
     * Get the persisted config map.
     *
     * @param ctx      The application context.
     * @param callback The function to be exec as the callback.
     */
    void loadConfig(CallbackContext callback, Context ctx) {
        SharedPreferences settings = getSharedPreferences(ctx);
        String json       = settings.getString(CONFIG_KEY, "{}");
        JSONObject config;

        try {
            config = new JSONObject(json);
        } catch (JSONException e) {
            config = new JSONObject();
        }

        PluginResult result;
        result = new PluginResult(PluginResult.Status.OK, config);

        callback.sendPluginResult(result);
    }

    /**
     * Persist the config map so that `autoClear` has same value after restart.
     *
     * @param config The config map to persist.
     * @param ctx    The application context.
     */
    void saveConfig(JSONObject config, Context ctx) {
        SharedPreferences.Editor editor = getSharedPreferences(ctx).edit();

        editor.putString(CONFIG_KEY, config.toString());
        editor.apply();
    }

    /**
     * Persist the badge of the app icon so that `getBadge` is able to return
     * the badge number back to the client.
     *
     * @param badge The badge number to persist.
     * @param ctx   The application context.
     */
    private void saveBadge (int badge, Context ctx) {
        SharedPreferences.Editor editor = getSharedPreferences(ctx).edit();

        editor.putInt(BADGE_KEY, badge);
        editor.apply();
    }

    /**
     * The Local storage for the application.
     */
    private SharedPreferences getSharedPreferences (Context context) {
        return context.getSharedPreferences(BADGE_KEY, Context.MODE_PRIVATE);
    }

}
