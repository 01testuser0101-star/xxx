const fs = require('fs');
const path = require('path');
const {
  AndroidConfig,
  createRunOncePlugin,
  withAndroidManifest,
  withDangerousMod,
  withInfoPlist,
  withProjectBuildGradle,
} = require('@expo/config-plugins');

const pkg = require('../package.json');

const LOCATION_PERMISSIONS = [
  'android.permission.ACCESS_COARSE_LOCATION',
  'android.permission.ACCESS_FINE_LOCATION',
];

function addMapboxMavenRepository(contents) {
  if (contents.includes('api.mapbox.com/downloads/v2/releases/maven')) {
    return contents;
  }

  const mapboxMaven = `maven {
            url 'https://api.mapbox.com/downloads/v2/releases/maven'
            authentication { basic(BasicAuthentication) }
            credentials {
                username = 'mapbox'
                password = providers.gradleProperty('MAPBOX_DOWNLOADS_TOKEN').orElse(providers.environmentVariable('MAPBOX_DOWNLOADS_TOKEN')).getOrElse('')
            }
        }`;

  if (contents.includes('dependencyResolutionManagement')) {
    return contents.replace(/repositories\s*\{/, match => `${match}\n        ${mapboxMaven}`);
  }

  return contents.replace(
    /allprojects\s*\{\s*repositories\s*\{/,
    match => `${match}\n        ${mapboxMaven}`,
  );
}

function withMapboxNavigation(config, props = {}) {
  const {
    accessToken,
    enableBackgroundLocation = false,
    locationWhenInUsePermission = 'Allow this app to use your location for turn-by-turn navigation.',
    locationAlwaysPermission = 'Allow this app to keep navigation active while it is in the background.',
  } = props;

  config = withInfoPlist(config, infoPlistConfig => {
    infoPlistConfig.modResults.NSLocationWhenInUseUsageDescription =
      locationWhenInUsePermission;

    if (enableBackgroundLocation) {
      infoPlistConfig.modResults.NSLocationAlwaysAndWhenInUseUsageDescription =
        locationAlwaysPermission;
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

    gradleConfig.modResults.contents = addMapboxMavenRepository(
      gradleConfig.modResults.contents,
    );

    return gradleConfig;
  });

  config = withDangerousMod(config, [
    'android',
    dangerousConfig => {
      const settingsGradle = path.join(dangerousConfig.modRequest.platformProjectRoot, 'settings.gradle');

      if (fs.existsSync(settingsGradle)) {
        const contents = fs.readFileSync(settingsGradle, 'utf8');
        const nextContents = addMapboxMavenRepository(contents);

        if (nextContents !== contents) {
          fs.writeFileSync(settingsGradle, nextContents);
        }
      }

      return dangerousConfig;
    },
  ]);

  return config;
}

module.exports = createRunOncePlugin(
  withMapboxNavigation,
  pkg.name,
  pkg.version,
);
