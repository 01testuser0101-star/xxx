import React from 'react';
import {requireNativeComponent} from 'react-native';
import type {HostComponent} from 'react-native';
import type {MapboxNavigationViewProps} from './types';

const NativeMapboxNavigationView = requireNativeComponent<MapboxNavigationViewProps>(
  'MapboxNavigationWrapperView',
) as HostComponent<MapboxNavigationViewProps>;

export function MapboxNavigationView(
  props: MapboxNavigationViewProps,
): React.JSX.Element {
  return <NativeMapboxNavigationView {...props} />;
}
