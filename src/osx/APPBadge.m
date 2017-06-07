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

#import "APPBadge.h"

@implementation APPBadge

static NSString * const kAPPBadgeConfigKey = @"APPBadgeConfigKey";

#pragma mark -
#pragma mark Interface

/**
 * Load the badge config.
 */
- (void) load:(CDVInvokedUrlCommand *)command
{
    [self.commandDelegate runInBackground:^{
        NSDictionary *config = [self.settings objectForKey:kAPPBadgeConfigKey];

        CDVPluginResult* result;
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK
                                   messageAsDictionary:config];

        [self.commandDelegate sendPluginResult:result
                                    callbackId:command.callbackId];
    }];
}

/**
 * Save the badge config.
 */
- (void) save:(CDVInvokedUrlCommand *)command
{
    [self.commandDelegate runInBackground:^{
        [self.settings setObject:[command argumentAtIndex:0]
                          forKey:kAPPBadgeConfigKey];
    }];
}

/**
 * Clear the badge number.
 */
- (void) clear:(CDVInvokedUrlCommand *)command
{
    [self.commandDelegate runInBackground:^{
        [self.dock setBadgeLabel:@""];

        [self sendPluginResult:CDVCommandStatus_OK
                 messageAsLong:0
                    callbackId:command.callbackId];
    }];
}

/**
 * Set the badge number.
 */
- (void) set:(CDVInvokedUrlCommand *)command
{
    NSArray* args = [command arguments];
    int number    = [[args objectAtIndex:0] intValue];

    if (number == 0)
        return [self clear:command];
    
    [self.commandDelegate runInBackground:^{
        [self.dock setBadgeLabel:@(number).stringValue];

        [self sendPluginResult:CDVCommandStatus_OK
                 messageAsLong:number
                    callbackId:command.callbackId];
    }];
}

/**
 * Get the badge number.
 */
- (void) get:(CDVInvokedUrlCommand *)command
{
    [self.commandDelegate runInBackground:^{
        NSString *label = [self.dock badgeLabel];
        int badge       = label.intValue;

        [self sendPluginResult:CDVCommandStatus_OK
                 messageAsLong:badge
                    callbackId:command.callbackId];
    }];
}

#pragma mark -
#pragma mark Helper

/**
 * Short hand for shared application instance.
 */
- (NSDockTile*) dock
{
    return [NSApp dockTile];
}

/**
 * Short hand for standard user defaults instance.
 */
- (NSUserDefaults*) settings
{
    return [NSUserDefaults standardUserDefaults];
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
