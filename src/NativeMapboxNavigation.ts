import {NativeEventEmitter, NativeModules, Platform} from 'react-native';
import type {EmitterSubscription} from 'react-native';
import type {
  CalculateRoutesOptions,
  MapboxNavigationEvent,
  NavigationPermissionStatus,
  OfflineRegion,
  OfflineRegionOptions,
  RoutePreview,
  StartNavigationOptions,
} from './types';

type NativeMapboxNavigationModule = {
  startNavigation(options: StartNavigationOptions): Promise<void>;
  stopNavigation(): Promise<void>;
  pauseNavigation(): Promise<void>;
  resumeNavigation(): Promise<void>;
  calculateRoutes(options: CalculateRoutesOptions): Promise<RoutePreview[]>;
  startNavigationWithRoute(routeId: string, options?: Partial<StartNavigationOptions>): Promise<void>;
  selectRoute(routeId: string): Promise<void>;
  clearRoutes(): Promise<void>;
  setMute(mute: boolean): Promise<void>;
  checkLocationPermission(): Promise<NavigationPermissionStatus>;
  requestLocationPermission(): Promise<NavigationPermissionStatus>;
  openLocationSettings(): Promise<void>;
  createOfflineRegion(options: OfflineRegionOptions): Promise<OfflineRegion>;
  deleteOfflineRegion(id: string): Promise<void>;
  listOfflineRegions(): Promise<OfflineRegion[]>;
  setPredictiveCacheEnabled(enabled: boolean, options?: Record<string, unknown>): Promise<void>;
  clearPredictiveCache(): Promise<void>;
  addListener(eventName: string): void;
  removeListeners(count: number): void;
};

const LINKING_ERROR =
  'react-native-mapbox-navigation-wrapper is not linked. Rebuild the native app after installing the package.';

const nativeModule = NativeModules.MapboxNavigationWrapper as
  | NativeMapboxNavigationModule
  | undefined;

function getNativeModule(): NativeMapboxNavigationModule {
  if (!nativeModule) {
    throw new Error(LINKING_ERROR);
  }

  return nativeModule;
}

const eventEmitter = nativeModule ? new NativeEventEmitter(nativeModule) : undefined;

export function startNavigation(options: StartNavigationOptions): Promise<void> {
  return getNativeModule().startNavigation(options);
}

export function stopNavigation(): Promise<void> {
  return getNativeModule().stopNavigation();
}

export function pauseNavigation(): Promise<void> {
  return getNativeModule().pauseNavigation();
}

export function resumeNavigation(): Promise<void> {
  return getNativeModule().resumeNavigation();
}

export function calculateRoutes(options: CalculateRoutesOptions): Promise<RoutePreview[]> {
  return getNativeModule().calculateRoutes(options);
}

export function startNavigationWithRoute(
  routeId: string,
  options?: Partial<StartNavigationOptions>,
): Promise<void> {
  return getNativeModule().startNavigationWithRoute(routeId, options);
}

export function selectRoute(routeId: string): Promise<void> {
  return getNativeModule().selectRoute(routeId);
}

export function clearRoutes(): Promise<void> {
  return getNativeModule().clearRoutes();
}

export function setNavigationMute(mute: boolean): Promise<void> {
  return getNativeModule().setMute(mute);
}

export function checkLocationPermission(): Promise<NavigationPermissionStatus> {
  return getNativeModule().checkLocationPermission();
}

export function requestLocationPermission(): Promise<NavigationPermissionStatus> {
  return getNativeModule().requestLocationPermission();
}

export function openLocationSettings(): Promise<void> {
  return getNativeModule().openLocationSettings();
}

export function createOfflineRegion(options: OfflineRegionOptions): Promise<OfflineRegion> {
  return getNativeModule().createOfflineRegion(options);
}

export function deleteOfflineRegion(id: string): Promise<void> {
  return getNativeModule().deleteOfflineRegion(id);
}

export function listOfflineRegions(): Promise<OfflineRegion[]> {
  return getNativeModule().listOfflineRegions();
}

export function setPredictiveCacheEnabled(
  enabled: boolean,
  options?: Record<string, unknown>,
): Promise<void> {
  return getNativeModule().setPredictiveCacheEnabled(enabled, options);
}

export function clearPredictiveCache(): Promise<void> {
  return getNativeModule().clearPredictiveCache();
}

export function addMapboxNavigationListener(
  listener: (event: MapboxNavigationEvent) => void,
): EmitterSubscription {
  if (!eventEmitter) {
    throw new Error(LINKING_ERROR);
  }

  return eventEmitter.addListener('MapboxNavigationEvent', listener);
}

export const isMapboxNavigationAvailable = Platform.select({
  android: Boolean(nativeModule),
  ios: Boolean(nativeModule),
  default: false,
});
