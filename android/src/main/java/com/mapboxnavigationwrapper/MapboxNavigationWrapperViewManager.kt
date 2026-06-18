package com.mapboxnavigationwrapper

import android.view.View
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext

class MapboxNavigationWrapperViewManager : SimpleViewManager<View>() {
  override fun getName(): String = "MapboxNavigationWrapperView"

  override fun createViewInstance(reactContext: ThemedReactContext): View {
    // Placeholder host view for the native navigation UI. Replace this with the
    // Mapbox Navigation UX view/fragment once the host app credentials are configured.
    return View(reactContext)
  }
}
