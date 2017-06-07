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

#import <XCTest/XCTest.h>
#import <Cordova/CDVViewController.h>
#import <Cordova/CDVBridge.h>

#import "CDVWebViewTest.h"

@interface CDVPluginsTest : CDVWebViewTest
@end

@implementation CDVPluginsTest

- (void) setUp {
    [super setUp];
}

- (void) tearDown {
    [super tearDown];
}

- (void) testEcho {
    [self viewController];

    NSString* testId = [self.webView stringByEvaluatingJavaScriptFromString:@"runTests()"];

    NSLog(@"waiting for test %@", testId);
    NSString *jsString = [NSString stringWithFormat:@"window.jsTests['%@'].result", testId];

    __block NSString *result;
    [self waitForConditionName:testId block:^{
        result = [self evalJs:jsString];
        return (BOOL) (result.length > 0);
    }];
    XCTAssertTrue([result isEqualToString:@"true"], @"test should succeed");
}


@end
