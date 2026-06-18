import React, {useMemo, useState} from 'react';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import {
  Alert,
  Linking,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Mapbox from '@rnmapbox/maps';

const MAPBOX_PUBLIC_TOKEN = process.env.MAPBOX_PUBLIC_TOKEN ?? '';
const DEFAULT_CENTER: [number, number] = [-74.006, 40.7128];

Mapbox.setAccessToken(MAPBOX_PUBLIC_TOKEN);

function App(): React.JSX.Element {
  const [showTokenHelp, setShowTokenHelp] = useState(!MAPBOX_PUBLIC_TOKEN);
  const mapStyle = useMemo(() => Mapbox.StyleURL.Street, []);

  const openTokenDocs = async () => {
    const url = 'https://docs.mapbox.com/help/getting-started/access-tokens/';
    const canOpen = await Linking.canOpenURL(url);

    if (canOpen) {
      await Linking.openURL(url);
    } else {
      Alert.alert('Mapbox access tokens', url);
    }
  };

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>React Native + Mapbox</Text>
          <Text style={styles.title}>Latest Mapbox SDK starter</Text>
          <Text style={styles.subtitle}>
            A bare React Native app using @rnmapbox/maps and the Mapbox Maps SDK
            v11 defaults.
          </Text>
        </View>

        <View style={styles.mapCard}>
          {MAPBOX_PUBLIC_TOKEN ? (
            <Mapbox.MapView
              style={styles.map}
              styleURL={mapStyle}
              logoEnabled
              attributionEnabled
              scaleBarEnabled={false}>
              <Mapbox.Camera
                zoomLevel={11}
                centerCoordinate={DEFAULT_CENTER}
                animationMode="flyTo"
                animationDuration={1200}
              />
              <Mapbox.PointAnnotation id="nyc" coordinate={DEFAULT_CENTER}>
                <View style={styles.marker} />
              </Mapbox.PointAnnotation>
            </Mapbox.MapView>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>Add your Mapbox public token</Text>
              <Text style={styles.emptyText}>
                Set MAPBOX_PUBLIC_TOKEN before launching the app so the native
                SDK can load map tiles.
              </Text>
              {showTokenHelp ? (
                <Pressable style={styles.button} onPress={openTokenDocs}>
                  <Text style={styles.buttonText}>Open token docs</Text>
                </Pressable>
              ) : null}
              <Pressable onPress={() => setShowTokenHelp(value => !value)}>
                <Text style={styles.linkText}>
                  {showTokenHelp ? 'Hide help' : 'Show help'}
                </Text>
              </Pressable>
            </View>
          )}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Platform: {Platform.OS} · New Architecture ready
          </Text>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#06111f',
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    paddingTop: 18,
  },
  eyebrow: {
    color: '#7dd3fc',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  title: {
    color: '#ffffff',
    fontSize: 30,
    fontWeight: '800',
  },
  subtitle: {
    color: '#cbd5e1',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 10,
  },
  mapCard: {
    flex: 1,
    backgroundColor: '#0f172a',
    borderRadius: 28,
    margin: 16,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  marker: {
    backgroundColor: '#ef4444',
    borderColor: '#ffffff',
    borderRadius: 10,
    borderWidth: 3,
    height: 20,
    width: 20,
  },
  emptyState: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  emptyTitle: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyText: {
    color: '#cbd5e1',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#2563eb',
    borderRadius: 999,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  linkText: {
    color: '#93c5fd',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 18,
  },
  footer: {
    paddingBottom: 14,
    paddingHorizontal: 20,
  },
  footerText: {
    color: '#94a3b8',
    fontSize: 13,
    textAlign: 'center',
  },
});

export default App;
