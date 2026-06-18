import UIKit
import React

@objc(MapboxNavigationWrapperViewManager)
final class MapboxNavigationWrapperViewManager: RCTViewManager {
  override static func requiresMainQueueSetup() -> Bool {
    true
  }

  override func view() -> UIView! {
    // Placeholder host view for embedded navigation. Replace this with Mapbox's
    // NavigationMapView/NavigationViewController composition when native credentials
    // and route lifecycle are wired.
    UIView()
  }
}
