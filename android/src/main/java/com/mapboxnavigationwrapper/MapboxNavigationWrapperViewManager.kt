package com.mapboxnavigationwrapper

import android.view.View
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp

class MapboxNavigationWrapperViewManager : SimpleViewManager<View>() {
  override fun getName(): String = "MapboxNavigationWrapperView"

  override fun createViewInstance(reactContext: ThemedReactContext): View {
    // Production implementation should return a native Mapbox Navigation UI container.
    return View(reactContext)
  }

  @ReactProp(name = "destination")
  fun setDestination(view: View, destination: ReadableMap?) = Unit

  @ReactProp(name = "origin")
  fun setOrigin(view: View, origin: ReadableMap?) = Unit

  @ReactProp(name = "waypoints")
  fun setWaypoints(view: View, waypoints: ReadableArray?) = Unit

  @ReactProp(name = "profile")
  fun setProfile(view: View, profile: String?) = Unit

  @ReactProp(name = "mode")
  fun setMode(view: View, mode: String?) = Unit

  @ReactProp(name = "simulateRoute")
  fun setSimulateRoute(view: View, simulateRoute: Boolean) = Unit

  @ReactProp(name = "mute")
  fun setMute(view: View, mute: Boolean) = Unit

  @ReactProp(name = "ui")
  fun setUi(view: View, ui: ReadableMap?) = Unit
}
