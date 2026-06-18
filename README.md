# Mapbox React Native Latest

A modern bare React Native starter project for running Mapbox maps with the community-maintained [`@rnmapbox/maps`](https://github.com/rnmapbox/maps) package.

## Current module choices

- React Native `0.86.0`
- React `19.1.0`
- `@rnmapbox/maps` `10.3.1`
- Mapbox Maps SDK v11 defaults through `@rnmapbox/maps`
- TypeScript-first app source in `src/App.tsx`

## Prerequisites

1. Install Node.js 22 or newer.
2. Set up the React Native Android and/or iOS native build toolchains.
3. Create a Mapbox public access token.
4. For iOS, install CocoaPods.

## Setup

```sh
npm install
cp .env.example .env
```

Edit `.env` and set `MAPBOX_PUBLIC_TOKEN` to a public Mapbox access token.

> The sample app reads `process.env.MAPBOX_PUBLIC_TOKEN`. If your React Native bundler setup does not inject environment variables automatically, add your preferred environment plugin or replace the value in `src/App.tsx` during local development.

## Run

Start Metro:

```sh
npm start
```

Run Android:

```sh
npm run android
```

Run iOS:

```sh
cd ios && pod install && cd ..
npm run ios
```

## Native project generation

This repository contains the JavaScript/TypeScript project scaffold. If native `android/` and `ios/` folders are not present yet, generate them with the React Native CLI for the pinned version:

```sh
npx @react-native-community/cli init MapboxReactNativeLatest --version 0.86.0
```

Then copy this project's `src/`, `package.json`, `app.json`, `index.js`, `babel.config.js`, `metro.config.js`, and TypeScript/lint config files into the generated app.

## Mapbox notes

- `@rnmapbox/maps` is the supported community package for Mapbox in React Native.
- The older `@react-native-mapbox-gl/maps` package is deprecated and intentionally not used here.
- `@rnmapbox/maps` 10.2+ defaults to Mapbox Maps SDK v11, which is recommended for new projects.
