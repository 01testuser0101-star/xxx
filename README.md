# React Native Mapbox Navigation Wrapper

Reusable React Native native module scaffold for wrapping the Mapbox turn-by-turn Navigation SDK on iOS and Android.

This package is intended to be installed by another React Native app as a library. It exposes a typed JavaScript API, native iOS/Android package entry points, and an optional Expo config plugin for Expo prebuild/EAS consumers.

> Status: foundation scaffold. Native package registration, TypeScript API, CocoaPods/Gradle dependency wiring, and Expo config plugin are included. The full Mapbox route/session UI implementation should be completed inside the native module methods before publishing as production-ready navigation.

## Features

- TypeScript API for starting/stopping navigation.
- React Native event listener for navigation events.
- Native view placeholder for an embedded navigation screen.
- Android library module with Mapbox Navigation SDK dependencies.
- iOS podspec with Mapbox Navigation SDK dependency.
- Expo config plugin for tokens, location permissions, background navigation options, and Mapbox Maven setup.

## Installation in a bare React Native app

```sh
npm install react-native-mapbox-navigation-wrapper
```

### Android

Set a Mapbox downloads token for Gradle dependency resolution:

```properties
# android/gradle.properties
MAPBOX_DOWNLOADS_TOKEN=sk.your_downloads_token
```

The library contributes foreground location permissions from its manifest. Host apps should request runtime location permission before starting active navigation.

### iOS

Run CocoaPods after installing the package:

```sh
cd ios && pod install && cd ..
```

Add a location usage string in the host app `Info.plist` if not using the Expo config plugin:

```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>Allow this app to use your location for turn-by-turn navigation.</string>
```

## Installation in an Expo prebuild/EAS app

Expo Go is not supported because Mapbox Navigation requires custom native code. Use EAS Build or a custom dev client.

```json
{
  "expo": {
    "plugins": [
      [
        "react-native-mapbox-navigation-wrapper",
        {
          "accessToken": "pk.your_public_token",
          "enableBackgroundLocation": false,
          "locationWhenInUsePermission": "Allow this app to use your location for turn-by-turn navigation."
        }
      ]
    ]
  }
}
```

Set `MAPBOX_DOWNLOADS_TOKEN` in your EAS environment for Android builds.

## JavaScript API

```tsx
import {
  MapboxNavigationView,
  addMapboxNavigationListener,
  startNavigation,
  stopNavigation,
} from 'react-native-mapbox-navigation-wrapper';

const subscription = addMapboxNavigationListener(event => {
  if (event.type === 'routeProgress') {
    console.log(event.payload.distanceRemaining);
  }
});

await startNavigation({
  destination: {
    latitude: 40.7128,
    longitude: -74.006,
    name: 'New York City',
  },
  profile: 'driving-traffic',
  simulateRoute: false,
});

await stopNavigation();
subscription.remove();
```

Embedded view placeholder:

```tsx
<MapboxNavigationView
  style={{flex: 1}}
  destination={{latitude: 40.7128, longitude: -74.006}}
  profile="driving-traffic"
  onRouteProgress={event => console.log(event.distanceRemaining)}
/>
```

## Native implementation roadmap

1. Replace the native placeholder methods with real Mapbox route/session lifecycle code.
2. Android: create `MapboxNavigationApp`, request routes, attach observers, and host Mapbox navigation UX in an Activity/Fragment/View.
3. iOS: create/present `NavigationViewController`, wire delegate callbacks, and embed navigation views when `MapboxNavigationView` is used.
4. Forward route progress, arrival, cancel, voice, banner, reroute, and error callbacks to the JS event API.
5. Add an example app that consumes this package exactly like an external React Native app would.

## Public API

See [`src/types.ts`](src/types.ts) for the typed options and events exposed to host applications.
