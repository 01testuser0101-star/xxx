#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>
#import <React/RCTViewManager.h>

@interface RCT_EXTERN_MODULE(MapboxNavigationWrapper, RCTEventEmitter)
RCT_EXTERN_METHOD(startNavigation:(NSDictionary *)options resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(stopNavigation:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(pauseNavigation:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(resumeNavigation:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(calculateRoutes:(NSDictionary *)options resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(startNavigationWithRoute:(NSString *)routeId options:(NSDictionary *)options resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(selectRoute:(NSString *)routeId resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(clearRoutes:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(setMute:(BOOL)mute resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(checkLocationPermission:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(requestLocationPermission:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(openLocationSettings:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(createOfflineRegion:(NSDictionary *)options resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(deleteOfflineRegion:(NSString *)id resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(listOfflineRegions:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(setPredictiveCacheEnabled:(BOOL)enabled options:(NSDictionary *)options resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(clearPredictiveCache:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
@end

@interface RCT_EXTERN_MODULE(MapboxNavigationWrapperViewManager, RCTViewManager)
RCT_EXPORT_VIEW_PROPERTY(destination, NSDictionary)
RCT_EXPORT_VIEW_PROPERTY(origin, NSDictionary)
RCT_EXPORT_VIEW_PROPERTY(waypoints, NSArray)
RCT_EXPORT_VIEW_PROPERTY(profile, NSString)
RCT_EXPORT_VIEW_PROPERTY(mode, NSString)
RCT_EXPORT_VIEW_PROPERTY(simulateRoute, BOOL)
RCT_EXPORT_VIEW_PROPERTY(mute, BOOL)
RCT_EXPORT_VIEW_PROPERTY(ui, NSDictionary)
@end
