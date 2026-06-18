export type MapboxNavigationProfile = 'driving' | 'driving-traffic' | 'walking' | 'cycling';

export type MapboxNavigationMode = 'fullscreen' | 'embedded' | 'headless';

export type MapboxCoordinate = {
  latitude: number;
  longitude: number;
};

export type MapboxWaypoint = MapboxCoordinate & {
  name?: string;
  separatesLegs?: boolean;
};

export type MapboxRouteAvoidance =
  | 'toll'
  | 'motorway'
  | 'ferry'
  | 'unpaved'
  | 'cash_only_tolls'
  | 'border_crossing';

export type MapboxRouteLineOptions = {
  visible?: boolean;
  primaryColor?: string;
  alternativeColor?: string;
  traversedColor?: string;
  casingColor?: string;
};

export type MapboxCameraOptions = {
  followUserLocation?: boolean;
  showRecenterButton?: boolean;
  pitch?: number;
  zoom?: number;
};

export type MapboxNavigationUiOptions = {
  mapStyleUri?: string;
  dayStyleUri?: string;
  nightStyleUri?: string;
  showCancelButton?: boolean;
  showTripProgress?: boolean;
  showManeuverView?: boolean;
  showSpeedLimits?: boolean;
  showFeedback?: boolean;
  routeLine?: MapboxRouteLineOptions;
  camera?: MapboxCameraOptions;
};

export type StartNavigationOptions = {
  destination: MapboxWaypoint;
  origin?: MapboxCoordinate;
  waypoints?: MapboxWaypoint[];
  profile?: MapboxNavigationProfile;
  mode?: MapboxNavigationMode;
  alternatives?: boolean;
  avoid?: MapboxRouteAvoidance[];
  language?: string;
  units?: 'imperial' | 'metric';
  simulateRoute?: boolean;
  simulationSpeedMultiplier?: number;
  showsEndOfRouteFeedback?: boolean;
  mute?: boolean;
  ui?: MapboxNavigationUiOptions;
  android?: Record<string, unknown>;
  ios?: Record<string, unknown>;
};

export type CalculateRoutesOptions = Omit<StartNavigationOptions, 'mode' | 'ui' | 'mute'>;

export type RoutePreview = {
  id: string;
  distance: number;
  expectedTravelTime: number;
  profile: MapboxNavigationProfile;
  geometry?: string;
  legs?: RouteLegPreview[];
};

export type RouteLegPreview = {
  distance: number;
  expectedTravelTime: number;
  source?: string;
  destination?: string;
};

export type NavigationPermissionStatus =
  | 'granted'
  | 'denied'
  | 'blocked'
  | 'restricted'
  | 'notDetermined'
  | 'unavailable';

export type OfflineRegionOptions = {
  id?: string;
  name?: string;
  bounds: {
    northEast: MapboxCoordinate;
    southWest: MapboxCoordinate;
  };
  minZoom?: number;
  maxZoom?: number;
  styleUri?: string;
};

export type OfflineRegion = {
  id: string;
  name?: string;
  completedResourceCount?: number;
  completedResourceSize?: number;
};

export type MapboxNavigationViewProps = StartNavigationOptions & {
  style?: object;
  onRouteCalculationStarted?: () => void;
  onRouteCalculationSucceeded?: (event: RoutePreview) => void;
  onRouteCalculationFailed?: (event: MapboxNavigationErrorEvent) => void;
  onNavigationStarted?: () => void;
  onNavigationStopped?: () => void;
  onRouteProgress?: (event: MapboxRouteProgressEvent) => void;
  onLocationChanged?: (event: MapboxNavigationLocationEvent) => void;
  onOffRoute?: () => void;
  onRerouteStarted?: () => void;
  onRerouteSucceeded?: (event: RoutePreview) => void;
  onRerouteFailed?: (event: MapboxNavigationErrorEvent) => void;
  onAlternativeRoutesChanged?: (event: RoutePreview[]) => void;
  onArrival?: (event: MapboxArrivalEvent) => void;
  onFinalArrival?: () => void;
  onCancel?: () => void;
  onError?: (event: MapboxNavigationErrorEvent) => void;
  onVoiceInstruction?: (event: MapboxVoiceInstructionEvent) => void;
  onBannerInstruction?: (event: MapboxBannerInstructionEvent) => void;
};

export type MapboxRouteProgressEvent = {
  distanceRemaining: number;
  durationRemaining: number;
  fractionTraveled: number;
  currentLegIndex?: number;
  currentStepIndex?: number;
};

export type MapboxNavigationLocationEvent = MapboxCoordinate & {
  bearing?: number;
  speed?: number;
  accuracy?: number;
  timestamp?: number;
};

export type MapboxArrivalEvent = {
  waypointIndex: number;
  finalDestination?: boolean;
};

export type MapboxNavigationErrorEvent = {
  message: string;
  code?: string;
  nativeStack?: string;
};

export type MapboxVoiceInstructionEvent = {
  announcement: string;
  ssmlAnnouncement?: string;
};

export type MapboxBannerInstructionEvent = {
  primaryText: string;
  secondaryText?: string;
  subText?: string;
  distanceAlongStep?: number;
};

export type MapboxNavigationEvent =
  | {type: 'routeCalculationStarted'; payload?: undefined}
  | {type: 'routeCalculationSucceeded'; payload: RoutePreview}
  | {type: 'routeCalculationFailed'; payload: MapboxNavigationErrorEvent}
  | {type: 'navigationStarted'; payload?: undefined}
  | {type: 'navigationStopped'; payload?: undefined}
  | {type: 'routeProgress'; payload: MapboxRouteProgressEvent}
  | {type: 'locationChanged'; payload: MapboxNavigationLocationEvent}
  | {type: 'offRoute'; payload?: undefined}
  | {type: 'rerouteStarted'; payload?: undefined}
  | {type: 'rerouteSucceeded'; payload: RoutePreview}
  | {type: 'rerouteFailed'; payload: MapboxNavigationErrorEvent}
  | {type: 'alternativeRoutesChanged'; payload: RoutePreview[]}
  | {type: 'arrival'; payload: MapboxArrivalEvent}
  | {type: 'finalArrival'; payload?: undefined}
  | {type: 'cancel'; payload?: undefined}
  | {type: 'error'; payload: MapboxNavigationErrorEvent}
  | {type: 'voiceInstruction'; payload: MapboxVoiceInstructionEvent}
  | {type: 'bannerInstruction'; payload: MapboxBannerInstructionEvent}
  | {type: 'offlineRegionProgress'; payload: OfflineRegion}
  | {type: 'offlineRegionError'; payload: MapboxNavigationErrorEvent};
