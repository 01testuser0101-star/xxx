# React Native Mapbox Navigation Wrapper

Reusable React Native native module for Mapbox turn-by-turn Navigation SDK integration on iOS and Android.

This package is designed to be installed by another React Native app. It provides the JS/TypeScript API, iOS/Android native module surfaces, native dependency wiring, and an optional Expo config plugin needed for Expo prebuild/EAS projects.

> Implementation status: the package now exposes the full planned React Native API surface for full-screen, embedded, and headless navigation workflows. Native Android/iOS files contain the method entry points and validation hooks, but the final Mapbox SDK route/session/UI wiring still needs to be completed against the exact native SDK APIs in a buildable host app before production release.

## Capabilities covered by the public API

- Full-screen turn-by-turn navigation flow.
- Embedded `<MapboxNavigationView />` flow.
- Headless navigation flow for custom React Native UI.
- Route calculation and route preview APIs.
- Route selection and route clearing APIs.
- Runtime location permission helpers.
- Voice/banner instruction events.
- Route progress, reroute, off-route, arrival, cancel, and error events.
- Offline region and predictive cache API placeholders.
- Expo config plugin for iOS plist keys, Android permissions, Mapbox access token metadata, and Mapbox Maven repository setup.

## Installation in a bare React Native app

```sh
npm install react-native-mapbox-navigation-wrapper
```

### iOS

```sh
cd ios
pod install
cd ..
```

Add location usage text if your app does not use the Expo config plugin:

```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>Allow this app to use your location for turn-by-turn navigation.</string>
```

### Android

Set the Mapbox downloads token for Gradle dependency resolution:

```properties
# android/gradle.properties
MAPBOX_DOWNLOADS_TOKEN=sk.your_downloads_token
```

The public Mapbox token can be supplied through native app config or the Expo plugin. The downloads token should stay in Gradle properties or CI/EAS environment variables and should not be shipped to the app runtime.

## Expo / EAS usage

Expo Go is not supported because Mapbox Navigation requires custom native code. Use Expo prebuild, EAS Build, or a custom dev client.

```json
{
  "expo": {
    "plugins": [
      [
        "react-native-mapbox-navigation-wrapper",
        {
          "accessToken": "pk.your_public_mapbox_token",
          "enableBackgroundLocation": false,
          "locationWhenInUsePermission": "Allow this app to use your location for turn-by-turn navigation.",
          "locationAlwaysPermission": "Allow this app to keep navigation active while it is in the background."
        }
      ]
    ]
  }
}
```

Then build with:

```sh
npx expo prebuild
EAS_NO_VCS=1 eas build --platform ios
eas build --platform android
```

Set `MAPBOX_DOWNLOADS_TOKEN` in the EAS project environment for Android builds.

## Permission flow

```tsx
import {
  checkLocationPermission,
  requestLocationPermission,
  openLocationSettings,
} from 'react-native-mapbox-navigation-wrapper';

const status = await checkLocationPermission();

if (status !== 'granted') {
  const nextStatus = await requestLocationPermission();

  if (nextStatus !== 'granted') {
    await openLocationSettings();
  }
}
```

## Full-screen navigation

```tsx
import {
  addMapboxNavigationListener,
  startNavigation,
  stopNavigation,
} from 'react-native-mapbox-navigation-wrapper';

const subscription = addMapboxNavigationListener(event => {
  switch (event.type) {
    case 'routeProgress':
      console.log(event.payload.distanceRemaining, event.payload.durationRemaining);
      break;
    case 'arrival':
      console.log('Arrived at waypoint', event.payload.waypointIndex);
      break;
    case 'error':
      console.warn(event.payload.code, event.payload.message);
      break;
  }
});

await startNavigation({
  mode: 'fullscreen',
  destination: {
    latitude: 40.7128,
    longitude: -74.006,
    name: 'New York City',
  },
  profile: 'driving-traffic',
  alternatives: true,
  language: 'en',
  units: 'imperial',
  simulateRoute: false,
  ui: {
    showTripProgress: true,
    showManeuverView: true,
    showCancelButton: true,
    camera: {
      followUserLocation: true,
      showRecenterButton: true,
    },
  },
});

await stopNavigation();
subscription.remove();
```

## Embedded navigation view

```tsx
import {MapboxNavigationView} from 'react-native-mapbox-navigation-wrapper';

export function NavigationScreen() {
  return (
    <MapboxNavigationView
      style={{flex: 1}}
      mode="embedded"
      destination={{latitude: 40.7128, longitude: -74.006, name: 'NYC'}}
      profile="driving-traffic"
      alternatives
      simulateRoute={false}
      ui={{
        showTripProgress: true,
        showManeuverView: true,
        routeLine: {
          visible: true,
          primaryColor: '#2563eb',
        },
      }}
      onRouteProgress={event => {
        console.log(event.distanceRemaining, event.durationRemaining);
      }}
      onVoiceInstruction={event => {
        console.log(event.announcement);
      }}
      onArrival={event => {
        console.log('Arrived', event.waypointIndex);
      }}
      onError={event => {
        console.warn(event.message);
      }}
    />
  );
}
```

## Headless navigation

Use headless mode when the app wants to render its own React Native UI while receiving Mapbox navigation events from native guidance.

```tsx
await startNavigation({
  mode: 'headless',
  destination: {latitude: 40.7128, longitude: -74.006},
  profile: 'driving-traffic',
});
```

## Route preview and route selection

```tsx
import {
  calculateRoutes,
  selectRoute,
  startNavigationWithRoute,
} from 'react-native-mapbox-navigation-wrapper';

const routes = await calculateRoutes({
  origin: {latitude: 40.73061, longitude: -73.935242},
  destination: {latitude: 40.7128, longitude: -74.006},
  profile: 'driving-traffic',
  alternatives: true,
});

await selectRoute(routes[0].id);
await startNavigationWithRoute(routes[0].id, {mode: 'fullscreen'});
```

## Offline and predictive cache APIs

```tsx
import {
  createOfflineRegion,
  listOfflineRegions,
  setPredictiveCacheEnabled,
} from 'react-native-mapbox-navigation-wrapper';

await createOfflineRegion({
  name: 'Manhattan',
  bounds: {
    northEast: {latitude: 40.88, longitude: -73.90},
    southWest: {latitude: 40.68, longitude: -74.05},
  },
  minZoom: 10,
  maxZoom: 16,
});

await setPredictiveCacheEnabled(true);
const regions = await listOfflineRegions();
```

## Event names

The library normalizes native SDK callbacks into a single React Native event stream:

- `routeCalculationStarted`
- `routeCalculationSucceeded`
- `routeCalculationFailed`
- `navigationStarted`
- `navigationStopped`
- `routeProgress`
- `locationChanged`
- `offRoute`
- `rerouteStarted`
- `rerouteSucceeded`
- `rerouteFailed`
- `alternativeRoutesChanged`
- `arrival`
- `finalArrival`
- `cancel`
- `error`
- `voiceInstruction`
- `bannerInstruction`
- `offlineRegionProgress`
- `offlineRegionError`

See `src/types.ts` for the complete event payload definitions.

## Native implementation checklist before production release

1. Replace Android `not_implemented` rejections with real Mapbox Navigation SDK route/session/UI calls.
2. Replace iOS `not_implemented` rejections with real Mapbox Navigation SDK route/session/UI calls.
3. Replace Android embedded empty `View` with Mapbox navigation UI.
4. Replace iOS embedded empty `UIView` with Mapbox navigation UI.
5. Add a runnable example app that consumes this package as an external dependency.
6. Add CI that builds the Android library, runs `pod install` for iOS, typechecks TypeScript, and tests the Expo plugin.
