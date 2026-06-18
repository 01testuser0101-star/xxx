import Foundation
import React

@objc(MapboxNavigationWrapper)
final class MapboxNavigationWrapper: RCTEventEmitter {
  override static func requiresMainQueueSetup() -> Bool {
    true
  }

  override func supportedEvents() -> [String]! {
    ["MapboxNavigationEvent"]
  }

  @objc(startNavigation:resolver:rejecter:)
  func startNavigation(
    _ options: NSDictionary,
    resolver resolve: RCTPromiseResolveBlock,
    rejecter reject: RCTPromiseRejectBlock
  ) {
    // Package-level entry point for full-screen/native navigation. The first
    // production increment should create a Mapbox NavigationViewController, request
    // a route, present it from the current React Native root controller, and forward
    // delegate callbacks to JS events.
    sendEvent(
      withName: "MapboxNavigationEvent",
      body: [
        "type": "routeProgress",
        "payload": [
          "distanceRemaining": 0,
          "durationRemaining": 0,
          "fractionTraveled": 0,
        ],
      ]
    )
    resolve(nil)
  }

  @objc(stopNavigation:rejecter:)
  func stopNavigation(
    resolver resolve: RCTPromiseResolveBlock,
    rejecter reject: RCTPromiseRejectBlock
  ) {
    resolve(nil)
  }

  @objc(setMute:resolver:rejecter:)
  func setMute(
    _ mute: Bool,
    resolver resolve: RCTPromiseResolveBlock,
    rejecter reject: RCTPromiseRejectBlock
  ) {
    resolve(nil)
  }
}
