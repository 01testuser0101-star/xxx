export type MapboxNavigationProfile = 'driving' | 'driving-traffic' | 'walking' | 'cycling';

export type MapboxCoordinate = {
  latitude: number;
  longitude: number;
};

export type MapboxWaypoint = MapboxCoordinate & {
  name?: string;
};

export type StartNavigationOptions = {
  destination: MapboxWaypoint;
  origin?: MapboxCoordinate;
  waypoints?: MapboxWaypoint[];
  profile?: MapboxNavigationProfile;
  simulateRoute?: boolean;
  showsEndOfRouteFeedback?: boolean;
  mute?: boolean;
};

export type MapboxNavigationViewProps = StartNavigationOptions & {
  style?: object;
  onRouteProgress?: (event: MapboxRouteProgressEvent) => void;
  onArrival?: (event: MapboxArrivalEvent) => void;
  onCancel?: () => void;
  onError?: (event: MapboxNavigationErrorEvent) => void;
  onVoiceInstruction?: (event: MapboxVoiceInstructionEvent) => void;
  onBannerInstruction?: (event: MapboxBannerInstructionEvent) => void;
};

export type MapboxRouteProgressEvent = {
  distanceRemaining: number;
  durationRemaining: number;
  fractionTraveled: number;
};

export type MapboxArrivalEvent = {
  waypointIndex: number;
};

export type MapboxNavigationErrorEvent = {
  message: string;
  code?: string;
};

export type MapboxVoiceInstructionEvent = {
  announcement: string;
  ssmlAnnouncement?: string;
};

export type MapboxBannerInstructionEvent = {
  primaryText: string;
  secondaryText?: string;
  distanceAlongStep?: number;
};

export type MapboxNavigationEvent =
  | {type: 'routeProgress'; payload: MapboxRouteProgressEvent}
  | {type: 'arrival'; payload: MapboxArrivalEvent}
  | {type: 'cancel'; payload: undefined}
  | {type: 'error'; payload: MapboxNavigationErrorEvent}
  | {type: 'voiceInstruction'; payload: MapboxVoiceInstructionEvent}
  | {type: 'bannerInstruction'; payload: MapboxBannerInstructionEvent};
