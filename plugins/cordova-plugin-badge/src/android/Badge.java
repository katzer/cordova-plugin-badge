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

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class Badge extends CordovaPlugin {

    // Implementation of the badge interface methods
    private final BadgeImpl badgeImpl = new BadgeImpl();

    /**
     * Executes the request.
     *
     * @param action   The action to execute.
     * @param args     The exec() arguments.
     * @param callback The callback context used when
     *                 calling back into JavaScript.
     *
     * @return Returning false results in a "MethodNotFound" error.
     */
    @Override
    public boolean execute (String action, JSONArray args, CallbackContext callback)
            throws JSONException {

        if (action.equalsIgnoreCase("load")) {
            loadConfig(callback);
            return true;
        }

        if (action.equalsIgnoreCase("save")) {
            saveConfig(args.getJSONObject(0));
            return true;
        }

        if (action.equalsIgnoreCase("clear")) {
            clearBadge(callback);
            return true;
        }

        if (action.equalsIgnoreCase("get")) {
            getBadge(callback);
            return true;
        }

        if (action.equalsIgnoreCase("set")) {
            setBadge(args, callback);
            return true;
        }

        return false;
    }

    /**
     * Load the persisted plugin config.
     *
     * @param callback The function to be exec as the callback.
     */
    private void loadConfig(final CallbackContext callback) {
        cordova.getThreadPool().execute(new Runnable() {
            @Override
            public void run() {
                badgeImpl.loadConfig(callback, getContext());
            }
        });
    }

    /**
     * Persist the plugin config.
     *
     * @param config The config map to persist.
     */
    private void saveConfig(final JSONObject config) {
        cordova.getThreadPool().execute(new Runnable() {
            @Override
            public void run() {
                badgeImpl.saveConfig(config, getContext());
            }
        });
    }

    /**
     * Clear the badge number.
     *
     * @param callback The function to be exec as the callback.
     */
    private void clearBadge (final CallbackContext callback) {
        cordova.getThreadPool().execute(new Runnable() {
            @Override
            public void run() {
                badgeImpl.clearBadge(getContext());
                badgeImpl.getBadge(callback, getContext());
            }
        });
    }

    /**
     * Get the badge number.
     *
     * @param callback The function to be exec as the callback.
     */
    private void getBadge (final CallbackContext callback) {
        cordova.getThreadPool().execute(new Runnable() {
            @Override
            public void run() {
                badgeImpl.getBadge(callback, getContext());
            }
        });
    }

    /**
     * Set the badge number.
     *
     * @param args     The number to set as the badge number.
     * @param callback The function to be exec as the callback.
     */
    private void setBadge (final JSONArray args,
                           final CallbackContext callback) {

        cordova.getThreadPool().execute(new Runnable() {
            @Override
            public void run() {
                badgeImpl.clearBadge(getContext());
                badgeImpl.setBadge(args, getContext());
                badgeImpl.getBadge(callback, getContext());
            }
        });
    }

    /**
     * Returns the context of the activity.
     */
    private Context getContext () {
        return cordova.getActivity();
    }

}
