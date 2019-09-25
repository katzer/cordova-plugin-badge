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


#import <objc/runtime.h>
#import "NSWindow+Utils.h"

#define KEY_LEVEL_LOCKED @"level_lock"

@implementation NSWindow (Utils)


+ (NSWindow*) instance {
    static NSWindow* _instance = nil;

    @synchronized (self) {
        if (_instance == nil) {
            _instance = [[self alloc] init];
        }
    }

    return _instance;
}

- (float) titleBarHeight {
    NSRect frame = [self frame];
    NSRect contentRect = [NSWindow contentRectForFrameRect: frame
												 styleMask: NSTitledWindowMask];

    return (float) (frame.size.height - contentRect.size.height);
}

- (NSMutableDictionary*) props {
    NSMutableDictionary* p = objc_getAssociatedObject(self, @selector(props));
    if (p == nil) {
        p = [NSMutableDictionary dictionary];
        p[KEY_LEVEL_LOCKED] = @NO;
        objc_setAssociatedObject(self, @selector(props), p, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
    }
    return p;
}

- (bool) getIsLevelLocked {
    NSMutableDictionary* p = [self props];
    return [@YES isEqualTo:p[KEY_LEVEL_LOCKED]];
}

- (void) setIsLevelLocked:(bool) lock {
    NSMutableDictionary* p = [self props];
    p[KEY_LEVEL_LOCKED] = lock ? @YES : @NO;
}

- (void) swizzled_setLevel: (NSInteger) level {
    if ([self getIsLevelLocked]) {
        return;
    }

#pragma clang diagnostic push
#pragma ide diagnostic ignored "InfiniteRecursion"
    [self swizzled_setLevel:level];
#pragma clang diagnostic pop
}

+ (void)load {
    Method original, swizzled;

    original = class_getInstanceMethod(self, @selector(setLevel:));
    swizzled = class_getInstanceMethod(self, @selector(swizzled_setLevel:));
    method_exchangeImplementations(original, swizzled);
}

@end
