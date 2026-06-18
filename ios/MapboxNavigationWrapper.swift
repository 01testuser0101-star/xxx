import Foundation
import React
import UIKit

@objc(MapboxNavigationWrapper)
final class MapboxNavigationWrapper: RCTEventEmitter {
  private var cachedRoutes: [String: NSDictionary] = [:]

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
    guard options["destination"] != nil else {
      rejectWithEvent(reject, code: "missing_destination", message: "startNavigation requires a destination coordinate.")
      return
    }

    // Production implementation hook:
    // - build native route options from origin/destination/waypoints/profile/avoid/language/units
    // - request routes through Mapbox Navigation SDK
    // - create/present NavigationViewController for fullscreen mode
    // - attach route progress, reroute, voice, banner, arrival, and cancel delegates
    rejectNotImplemented(reject, method: "startNavigation")
  }

  @objc(stopNavigation:rejecter:)
  func stopNavigation(
    resolver resolve: RCTPromiseResolveBlock,
    rejecter reject: RCTPromiseRejectBlock
  ) {
    resolve(nil)
  }

  @objc(pauseNavigation:rejecter:)
  func pauseNavigation(
    resolver resolve: RCTPromiseResolveBlock,
    rejecter reject: RCTPromiseRejectBlock
  ) {
    resolve(nil)
  }

  @objc(resumeNavigation:rejecter:)
  func resumeNavigation(
    resolver resolve: RCTPromiseResolveBlock,
    rejecter reject: RCTPromiseRejectBlock
  ) {
    resolve(nil)
  }

  @objc(calculateRoutes:resolver:rejecter:)
  func calculateRoutes(
    _ options: NSDictionary,
    resolver resolve: RCTPromiseResolveBlock,
    rejecter reject: RCTPromiseRejectBlock
  ) {
    guard options["destination"] != nil else {
      rejectWithEvent(reject, code: "missing_destination", message: "calculateRoutes requires a destination coordinate.")
      return
    }

    sendEvent(withName: "MapboxNavigationEvent", body: ["type": "routeCalculationStarted"])
    rejectNotImplemented(reject, method: "calculateRoutes")
  }

  @objc(startNavigationWithRoute:options:resolver:rejecter:)
  func startNavigationWithRoute(
    _ routeId: NSString,
    options: NSDictionary?,
    resolver resolve: RCTPromiseResolveBlock,
    rejecter reject: RCTPromiseRejectBlock
  ) {
    guard cachedRoutes[routeId as String] != nil else {
      rejectWithEvent(reject, code: "route_not_found", message: "No cached route found for id: \(routeId)")
      return
    }

    rejectNotImplemented(reject, method: "startNavigationWithRoute")
  }

  @objc(selectRoute:resolver:rejecter:)
  func selectRoute(
    _ routeId: NSString,
    resolver resolve: RCTPromiseResolveBlock,
    rejecter reject: RCTPromiseRejectBlock
  ) {
    guard cachedRoutes[routeId as String] != nil else {
      rejectWithEvent(reject, code: "route_not_found", message: "No cached route found for id: \(routeId)")
      return
    }

    rejectNotImplemented(reject, method: "selectRoute")
  }

  @objc(clearRoutes:rejecter:)
  func clearRoutes(
    resolver resolve: RCTPromiseResolveBlock,
    rejecter reject: RCTPromiseRejectBlock
  ) {
    cachedRoutes.removeAll()
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

  @objc(checkLocationPermission:rejecter:)
  func checkLocationPermission(
    resolver resolve: RCTPromiseResolveBlock,
    rejecter reject: RCTPromiseRejectBlock
  ) {
    resolve("unavailable")
  }

  @objc(requestLocationPermission:rejecter:)
  func requestLocationPermission(
    resolver resolve: RCTPromiseResolveBlock,
    rejecter reject: RCTPromiseRejectBlock
  ) {
    resolve("unavailable")
  }

  @objc(openLocationSettings:rejecter:)
  func openLocationSettings(
    resolver resolve: RCTPromiseResolveBlock,
    rejecter reject: RCTPromiseRejectBlock
  ) {
    guard let url = URL(string: UIApplication.openSettingsURLString) else {
      rejectWithEvent(reject, code: "settings_unavailable", message: "Unable to open app settings.")
      return
    }

    DispatchQueue.main.async {
      UIApplication.shared.open(url)
      resolve(nil)
    }
  }

  @objc(createOfflineRegion:resolver:rejecter:)
  func createOfflineRegion(
    _ options: NSDictionary,
    resolver resolve: RCTPromiseResolveBlock,
    rejecter reject: RCTPromiseRejectBlock
  ) {
    rejectNotImplemented(reject, method: "createOfflineRegion")
  }

  @objc(deleteOfflineRegion:resolver:rejecter:)
  func deleteOfflineRegion(
    _ id: NSString,
    resolver resolve: RCTPromiseResolveBlock,
    rejecter reject: RCTPromiseRejectBlock
  ) {
    rejectNotImplemented(reject, method: "deleteOfflineRegion")
  }

  @objc(listOfflineRegions:rejecter:)
  func listOfflineRegions(
    resolver resolve: RCTPromiseResolveBlock,
    rejecter reject: RCTPromiseRejectBlock
  ) {
    resolve([])
  }

  @objc(setPredictiveCacheEnabled:options:resolver:rejecter:)
  func setPredictiveCacheEnabled(
    _ enabled: Bool,
    options: NSDictionary?,
    resolver resolve: RCTPromiseResolveBlock,
    rejecter reject: RCTPromiseRejectBlock
  ) {
    rejectNotImplemented(reject, method: "setPredictiveCacheEnabled")
  }

  @objc(clearPredictiveCache:rejecter:)
  func clearPredictiveCache(
    resolver resolve: RCTPromiseResolveBlock,
    rejecter reject: RCTPromiseRejectBlock
  ) {
    rejectNotImplemented(reject, method: "clearPredictiveCache")
  }

  private func rejectNotImplemented(_ reject: RCTPromiseRejectBlock, method: String) {
    rejectWithEvent(
      reject,
      code: "not_implemented",
      message: "\(method) has a stable React Native API surface, but the native Mapbox Navigation SDK implementation still needs to be wired."
    )
  }

  private func rejectWithEvent(_ reject: RCTPromiseRejectBlock, code: String, message: String) {
    reject("mapbox_navigation_\(code)", message, nil)
    sendEvent(
      withName: "MapboxNavigationEvent",
      body: [
        "type": "error",
        "payload": [
          "code": code,
          "message": message,
        ],
      ]
    )
  }
}
