/**
 *  APPBadge.h
 *  Cordova Badge Plugin
 *
 *  Created by Sebastian Katzer (github.com/katzer) on 10/08/2013.
 *  Copyright 2013 Sebastian Katzer. All rights reserved.
 *  GPL v2 licensed
 */

#import <Foundation/Foundation.h>
#import <Cordova/CDVPlugin.h>

@interface APPBadge : CDVPlugin

// Fügt dem App Icon einen Badge hinzu
- (void) setBadge:(CDVInvokedUrlCommand *)command;

@end