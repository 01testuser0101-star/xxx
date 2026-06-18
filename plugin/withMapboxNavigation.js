const {
  AndroidConfig,
  createRunOncePlugin,
  withAndroidManifest,
  withInfoPlist,
  withProjectBuildGradle,
} = require('@expo/config-plugins');

const pkg = require('../package.json');

const LOCATION_PERMISSIONS = [
  'android.permission.ACCESS_COARSE_LOCATION',
  'android.permission.ACCESS_FINE_LOCATION',
];

function withMapboxNavigation(config, props = {}) {
  const {
    accessToken,
    enableBackgroundLocation = false,
    locationWhenInUsePermission = 'Allow this app to use your location for turn-by-turn navigation.',
  } = props;

  config = withInfoPlist(config, infoPlistConfig => {
    infoPlistConfig.modResults.NSLocationWhenInUseUsageDescription =
      locationWhenInUsePermission;

    if (enableBackgroundLocation) {
      infoPlistConfig.modResults.NSLocationAlwaysAndWhenInUseUsageDescription =
        props.locationAlwaysPermission ??
        'Allow this app to keep navigation active while it is in the background.';
      infoPlistConfig.modResults.UIBackgroundModes = Array.from(
        new Set([...(infoPlistConfig.modResults.UIBackgroundModes ?? []), 'location']),
      );
    }

    if (accessToken) {
      infoPlistConfig.modResults.MBXAccessToken = accessToken;
    }

    return infoPlistConfig;
  });

  config = withAndroidManifest(config, androidManifestConfig => {
    const manifest = androidManifestConfig.modResults.manifest;

    for (const permission of LOCATION_PERMISSIONS) {
      AndroidConfig.Permissions.addPermission(androidManifestConfig.modResults, permission);
    }

    if (enableBackgroundLocation) {
      AndroidConfig.Permissions.addPermission(
        androidManifestConfig.modResults,
        'android.permission.FOREGROUND_SERVICE',
      );
      AndroidConfig.Permissions.addPermission(
        androidManifestConfig.modResults,
        'android.permission.FOREGROUND_SERVICE_LOCATION',
      );
      AndroidConfig.Permissions.addPermission(
        androidManifestConfig.modResults,
        'android.permission.ACCESS_BACKGROUND_LOCATION',
      );
    }

    if (accessToken) {
      const application = AndroidConfig.Manifest.getMainApplicationOrThrow(manifest);
      application['meta-data'] = application['meta-data'] ?? [];
      const existing = application['meta-data'].find(
        item => item.$?.['android:name'] === 'com.mapbox.token',
      );

      if (existing) {
        existing.$['android:value'] = accessToken;
      } else {
        application['meta-data'].push({
          $: {
            'android:name': 'com.mapbox.token',
            'android:value': accessToken,
          },
        });
      }
    }

    return androidManifestConfig;
  });

  config = withProjectBuildGradle(config, gradleConfig => {
    if (gradleConfig.modResults.language !== 'groovy') {
      return gradleConfig;
    }

    const mapboxMaven = `maven {\n            url 'https://api.mapbox.com/downloads/v2/releases/maven'\n            authentication { basic(BasicAuthentication) }\n            credentials {\n                username = 'mapbox'\n                password = project.findProperty('MAPBOX_DOWNLOADS_TOKEN') ?: System.getenv('MAPBOX_DOWNLOADS_TOKEN') ?: ''\n            }\n        }`;

    if (!gradleConfig.modResults.contents.includes('api.mapbox.com/downloads/v2/releases/maven')) {
      gradleConfig.modResults.contents = gradleConfig.modResults.contents.replace(
        /allprojects\s*\{\s*repositories\s*\{/,
        match => `${match}\n        ${mapboxMaven}`,
      );
    }

    return gradleConfig;
  });

  return config;
}

module.exports = createRunOncePlugin(
  withMapboxNavigation,
  pkg.name,
  pkg.version,
);
