package com.mapboxnavigationwrapper

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.provider.Settings
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
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
  private val cachedRoutes = mutableMapOf<String, ReadableMap>()

  override fun getName(): String = NAME

  @ReactMethod
  fun startNavigation(options: ReadableMap, promise: Promise) {
    if (!options.hasKey("destination")) {
      reject(promise, "missing_destination", "startNavigation requires a destination coordinate.")
      return
    }

    // Production implementation hook:
    // - initialize MapboxNavigationApp
    // - build RouteOptions from origin/destination/waypoints/profile/avoid/language/units
    // - request routes
    // - set NavigationRoutes and start trip session
    // - launch full-screen UI, embedded UI, or headless observers based on options.mode
    rejectNotImplemented(promise, "startNavigation")
  }

  @ReactMethod
  fun stopNavigation(promise: Promise) {
    // Production implementation should stop trip session, unregister observers, clear native UI,
    // and release MapboxNavigation resources that are owned by this module.
    promise.resolve(null)
  }

  @ReactMethod
  fun pauseNavigation(promise: Promise) {
    // Production implementation should pause active guidance or detach observers when supported.
    promise.resolve(null)
  }

  @ReactMethod
  fun resumeNavigation(promise: Promise) {
    // Production implementation should resume active guidance or reattach observers when supported.
    promise.resolve(null)
  }

  @ReactMethod
  fun calculateRoutes(options: ReadableMap, promise: Promise) {
    if (!options.hasKey("destination")) {
      reject(promise, "missing_destination", "calculateRoutes requires a destination coordinate.")
      return
    }

    emitEvent("routeCalculationStarted", null)
    rejectNotImplemented(promise, "calculateRoutes")
  }

  @ReactMethod
  fun startNavigationWithRoute(routeId: String, options: ReadableMap?, promise: Promise) {
    if (!cachedRoutes.containsKey(routeId)) {
      reject(promise, "route_not_found", "No cached route found for id: $routeId")
      return
    }

    rejectNotImplemented(promise, "startNavigationWithRoute")
  }

  @ReactMethod
  fun selectRoute(routeId: String, promise: Promise) {
    if (!cachedRoutes.containsKey(routeId)) {
      reject(promise, "route_not_found", "No cached route found for id: $routeId")
      return
    }

    rejectNotImplemented(promise, "selectRoute")
  }

  @ReactMethod
  fun clearRoutes(promise: Promise) {
    cachedRoutes.clear()
    promise.resolve(null)
  }

  @ReactMethod
  fun setMute(mute: Boolean, promise: Promise) {
    // Production implementation should connect to Mapbox voice instruction/player controls.
    promise.resolve(null)
  }

  @ReactMethod
  fun checkLocationPermission(promise: Promise) {
    val fine = ContextCompat.checkSelfPermission(
      reactContext,
      Manifest.permission.ACCESS_FINE_LOCATION,
    ) == PackageManager.PERMISSION_GRANTED
    val coarse = ContextCompat.checkSelfPermission(
      reactContext,
      Manifest.permission.ACCESS_COARSE_LOCATION,
    ) == PackageManager.PERMISSION_GRANTED

    promise.resolve(if (fine || coarse) "granted" else "denied")
  }

  @ReactMethod
  fun requestLocationPermission(promise: Promise) {
    val activity = currentActivity
    if (activity == null) {
      reject(promise, "activity_unavailable", "Cannot request location permission without a current Activity.")
      return
    }

    if (ContextCompat.checkSelfPermission(reactContext, Manifest.permission.ACCESS_FINE_LOCATION) ==
      PackageManager.PERMISSION_GRANTED
    ) {
      promise.resolve("granted")
      return
    }

    ActivityCompat.requestPermissions(
      activity,
      arrayOf(Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.ACCESS_COARSE_LOCATION),
      LOCATION_PERMISSION_REQUEST_CODE,
    )
    promise.resolve("notDetermined")
  }

  @ReactMethod
  fun openLocationSettings(promise: Promise) {
    val intent = Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS).apply {
      data = Uri.fromParts("package", reactContext.packageName, null)
      addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
    }
    reactContext.startActivity(intent)
    promise.resolve(null)
  }

  @ReactMethod
  fun createOfflineRegion(options: ReadableMap, promise: Promise) {
    rejectNotImplemented(promise, "createOfflineRegion")
  }

  @ReactMethod
  fun deleteOfflineRegion(id: String, promise: Promise) {
    rejectNotImplemented(promise, "deleteOfflineRegion")
  }

  @ReactMethod
  fun listOfflineRegions(promise: Promise) {
    promise.resolve(Arguments.createArray())
  }

  @ReactMethod
  fun setPredictiveCacheEnabled(enabled: Boolean, options: ReadableMap?, promise: Promise) {
    rejectNotImplemented(promise, "setPredictiveCacheEnabled")
  }

  @ReactMethod
  fun clearPredictiveCache(promise: Promise) {
    rejectNotImplemented(promise, "clearPredictiveCache")
  }

  @ReactMethod
  fun addListener(eventName: String) = Unit

  @ReactMethod
  fun removeListeners(count: Int) = Unit

  private fun rejectNotImplemented(promise: Promise, method: String) {
    reject(
      promise,
      "not_implemented",
      "$method has a stable React Native API surface, but the native Mapbox Navigation SDK implementation still needs to be wired.",
    )
  }

  private fun reject(promise: Promise, code: String, message: String) {
    promise.reject("mapbox_navigation_$code", message)
    emitEvent("error", Arguments.createMap().apply {
      putString("code", code)
      putString("message", message)
    })
  }

  private fun emitEvent(type: String, payload: Any?) {
    val event = Arguments.createMap().apply {
      putString("type", type)
      when (payload) {
        is com.facebook.react.bridge.WritableMap -> putMap("payload", payload)
        is com.facebook.react.bridge.WritableArray -> putArray("payload", payload)
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
    private const val LOCATION_PERMISSION_REQUEST_CODE = 8301
  }
}
