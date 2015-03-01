/*
 Copyright 2013-2014 appPlant UG

 Licensed to the Apache Software Foundation (ASF) under one
 or more contributor license agreements.  See the NOTICE file
 distributed with this work for additional information
 regarding copyright ownership.  The ASF licenses this file
 to you under the Apache License, Version 2.0 (the
 "License"); you may not use this file except in compliance
 with the License.  You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an
 "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 KIND, either express or implied.  See the License for the
 specific language governing permissions and limitations
 under the License.
 */

#import "APPBadge.h"
#import "AppDelegate+APPBadge.h"
#import "UIApplication+APPBadge.h"

@interface APPBadge ()

// Needed when calling `registerPermission`
@property (nonatomic, retain) CDVInvokedUrlCommand* command;

@end

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
        CDVPluginResult* result;
        long badge = [self.app applicationIconBadgeNumber];

        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK
                                   messageAsDouble:badge];

        [self.commandDelegate sendPluginResult:result
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
        CDVPluginResult* result;
        BOOL hasPermission;

        hasPermission = [self.app hasPermissionToDisplayBadges];

        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK
                                     messageAsBool:hasPermission];

        [self.commandDelegate sendPluginResult:result
                                    callbackId:command.callbackId];
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
    if (![[UIApplication sharedApplication]
         respondsToSelector:@selector(registerUserNotificationSettings:)])
    {
        return [self hasPermission:command];
    }

    _command = command;

    [self.commandDelegate runInBackground:^{
        [self.app registerPermissionToDisplayBadges];
    }];
}

#pragma mark -
#pragma mark Delegates

/**
 * Called on otification settings registration is completed.
 */
- (void) didRegisterUserNotificationSettings:(UIUserNotificationSettings*)settings
{
    if (_command)
    {
        [self hasPermission:_command];
        _command = NULL;
    }
}

#pragma mark -
#pragma mark Life Cycle

/**
 * Registers obervers after plugin was initialized.
 */
- (void) pluginInitialize
{
    NSNotificationCenter* center = [NSNotificationCenter
                                    defaultCenter];

    [center addObserver:self
               selector:@selector(didRegisterUserNotificationSettings:)
                   name:UIApplicationRegisterUserNotificationSettings
                 object:nil];
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

@end
