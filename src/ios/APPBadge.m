/*
 * Copyright (c) 2013-2016 by appPlant GmbH. All rights reserved.
 *
 * @APPPLANT_LICENSE_HEADER_START@
 *
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
 *
 * @APPPLANT_LICENSE_HEADER_END@
 */

#import "APPBadge.h"

@import UserNotifications;

@implementation APPBadge

#pragma mark -
#pragma mark Interface

/**
 * Clears the badge of the app icon.
 *
 */
- (void) clearBadge:(CDVInvokedUrlCommand *)command
{
    [self.commandDelegate runInBackground:^{
        [self.app setApplicationIconBadgeNumber:0];

        [self sendPluginResult:CDVCommandStatus_OK
                 messageAsLong:0
                    callbackId:command.callbackId];
    }];
}

/**
 * Sets the badge of the app icon.
 *
 * @param badge
 *      The badge to be set
 */
- (void) setBadge:(CDVInvokedUrlCommand *)command
{
    NSArray* args = [command arguments];
    int number    = [[args objectAtIndex:0] intValue];

    [self.commandDelegate runInBackground:^{
        [self.app setApplicationIconBadgeNumber:number];

        [self sendPluginResult:CDVCommandStatus_OK
                 messageAsLong:number
                    callbackId:command.callbackId];
    }];
}

/**
 * Gets the badge of the app icon.
 *
 * @param callback
 *      The function to be exec as the callback
 */
- (void) getBadge:(CDVInvokedUrlCommand *)command
{
    [self.commandDelegate runInBackground:^{
        long badge = [self.app applicationIconBadgeNumber];

        [self sendPluginResult:CDVCommandStatus_OK
                 messageAsLong:badge
                    callbackId:command.callbackId];
    }];
}

/**
 * Informs if the app has the permission to show badges.
 *
 * @param callback
 *      The function to be exec as the callback
 */
- (void) hasPermission:(CDVInvokedUrlCommand *)command
{
    [self.commandDelegate runInBackground:^{
        UNUserNotificationCenter *center =
        UNUserNotificationCenter.currentNotificationCenter;

        [center getNotificationSettingsWithCompletionHandler:
         ^(UNNotificationSettings* settings) {
             BOOL authorized =
             settings.authorizationStatus == UNAuthorizationStatusAuthorized;
             BOOL enabled =
             settings.badgeSetting == UNNotificationSettingEnabled;

             [self sendPluginResult:CDVCommandStatus_OK
                      messageAsBool:authorized && enabled
                         callbackId:command.callbackId];
        }];
    }];
}

/**
 * Register permission to show badges.
 *
 * @param callback
 *      The function to be exec as the callback
 */
- (void) registerPermission:(CDVInvokedUrlCommand *)command
{
    [self.commandDelegate runInBackground:^{
        UNUserNotificationCenter *center =
        UNUserNotificationCenter.currentNotificationCenter;

        UNAuthorizationOptions options = UNAuthorizationOptionBadge;

        [center requestAuthorizationWithOptions:options
                              completionHandler:^(BOOL granted, NSError* e) {
                                  [self sendPluginResult:CDVCommandStatus_OK
                                           messageAsBool:granted
                                              callbackId:command.callbackId];
        }];
    }];
}

#pragma mark -
#pragma mark Helper

/**
 * Short hand for shared application instance.
 */
- (UIApplication*) app
{
    return [UIApplication sharedApplication];
}

/**
 * Sends a plugin result with the specified status and message.
 */
- (void) sendPluginResult:(CDVCommandStatus)status
            messageAsBool:(BOOL)msg
               callbackId:(NSString*)callbackId
{
    CDVPluginResult* result;

    result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK
                                 messageAsBool:msg];

    [self.commandDelegate sendPluginResult:result
                                callbackId:callbackId];
}

/**
 * Sends a plugin result with the specified status and message.
 */
- (void) sendPluginResult:(CDVCommandStatus)status
            messageAsLong:(long)msg
               callbackId:(NSString*)callbackId
{
    CDVPluginResult* result;

    result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK
                                 messageAsDouble:msg];

    [self.commandDelegate sendPluginResult:result
                                callbackId:callbackId];
}

@end
