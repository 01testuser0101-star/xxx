import {NativeEventEmitter, NativeModules, Platform} from 'react-native';
import type {EmitterSubscription} from 'react-native';
import type {MapboxNavigationEvent, StartNavigationOptions} from './types';

type NativeMapboxNavigationModule = {
  startNavigation(options: StartNavigationOptions): Promise<void>;
  stopNavigation(): Promise<void>;
  setMute(mute: boolean): Promise<void>;
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

export function setNavigationMute(mute: boolean): Promise<void> {
  return getNativeModule().setMute(mute);
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
