package com.mapboxnavigationwrapper

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.modules.core.DeviceEventManagerModule

class MapboxNavigationWrapperModule(
  private val reactContext: ReactApplicationContext,
) : ReactContextBaseJavaModule(reactContext) {
  override fun getName(): String = NAME

  @ReactMethod
  fun startNavigation(options: ReadableMap, promise: Promise) {
    // This method is the package-level entry point for full-screen/native navigation.
    // Host apps can call it after the native SDK credentials are configured. The first
    // production increment should create MapboxNavigationApp, request a route, then
    // launch the Android navigation UX activity or fragment.
    emitEvent("routeProgress", Arguments.createMap().apply {
      putDouble("distanceRemaining", 0.0)
      putDouble("durationRemaining", 0.0)
      putDouble("fractionTraveled", 0.0)
    })
    promise.resolve(null)
  }

  @ReactMethod
  fun stopNavigation(promise: Promise) {
    promise.resolve(null)
  }

  @ReactMethod
  fun setMute(mute: Boolean, promise: Promise) {
    promise.resolve(null)
  }

  @ReactMethod
  fun addListener(eventName: String) = Unit

  @ReactMethod
  fun removeListeners(count: Int) = Unit

  private fun emitEvent(type: String, payload: Any?) {
    val event = Arguments.createMap().apply {
      putString("type", type)
      when (payload) {
        is com.facebook.react.bridge.WritableMap -> putMap("payload", payload)
        null -> putNull("payload")
      }
    }

    reactContext
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
      .emit(EVENT_NAME, event)
  }

  companion object {
    const val NAME = "MapboxNavigationWrapper"
    const val EVENT_NAME = "MapboxNavigationEvent"
  }
}
