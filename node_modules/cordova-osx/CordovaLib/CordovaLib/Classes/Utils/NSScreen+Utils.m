/*
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

#import "NSScreen+Utils.h"
#import <IOKit/graphics/IOGraphicsLib.h>

NSString* screenNameForDisplay(CGDirectDisplayID displayID) {
    NSString *screenName = nil;

    NSDictionary *deviceInfo = (__bridge NSDictionary *) IODisplayCreateInfoDictionary(CGDisplayIOServicePort(displayID), kIODisplayOnlyPreferredName);
    NSDictionary *localizedNames = deviceInfo[[NSString stringWithUTF8String:kDisplayProductName]];

    if ([localizedNames count] > 0) {
        screenName = localizedNames[[localizedNames allKeys][0]];
    }

    return screenName;
}

@implementation NSScreen (Utils)

+ (NSRect) fullScreenRect {
    CGFloat x0 = 0.0f;
    CGFloat y0 = 0.0f;
    CGFloat x1 = 0.0f;
    CGFloat y1 = 0.0f;

    NSArray* screens = [NSScreen screens];
    NSLog(@"Detected %lu display%s:", screens.count, screens.count > 1 ? "s" : "");
    for (NSScreen* screen in [NSScreen screens]) {
        NSNumber* screenID = [screen.deviceDescription objectForKey:@"NSScreenNumber"];
        CGDirectDisplayID aID = [screenID unsignedIntValue];
        NSLog(@"- %@ at: %.lf,%.lf size: %.lf x %.lf", screenNameForDisplay(aID),
                screen.frame.origin.x, screen.frame.origin.y,
                screen.frame.size.width, screen.frame.size.height);

        if (NSMinX(screen.frame) < x0) {
            x0 = NSMinX(screen.frame);
        };
        if (NSMinY(screen.frame) < y0) {
            y0 = NSMinY(screen.frame);
        };
        if (NSMaxX(screen.frame) > x1) {
            x1 = NSMaxX(screen.frame);
        };
        if (NSMaxY(screen.frame) > y1) {
            y1 = NSMaxY(screen.frame);
        };
    }
    if ([NSScreen screensHaveSeparateSpaces] && screens.count > 1) {
        NSLog(@"Fullscreen only possible to cover main screen. Disable 'Displays have separate Spaces' in 'System Preferences -> Mission Control' to span all displays.");
        return [NSScreen mainScreen].frame;
    }

    return NSMakeRect(x0, y0, x1-x0, y1-y0);
}

@end
