import type { ExpoConfig, ConfigContext } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name:        "StoryForge Kids",
  slug:        "storyforge-kids",
  version:     "1.0.0",
  orientation: "portrait",
  icon:        "./assets/icon.png",
  scheme:      "storyforge",
  userInterfaceStyle: "automatic",
  splash: {
    image:           "./assets/splash.png",
    resizeMode:      "contain",
    backgroundColor: "#4f46e5",
  },
  ios: {
    supportsTablet:  true,
    bundleIdentifier: "com.storyforge.kids",
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#4f46e5",
    },
    package: "com.storyforge.kids",
  },
  web: {
    bundler: "metro",
    output:  "static",
    favicon: "./assets/favicon.png",
  },
  plugins: [
    "expo-router",
    "expo-font",
    ["expo-notifications", { icon: "./assets/notification-icon.png", color: "#4f46e5" }],
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    apiUrl: process.env["EXPO_PUBLIC_API_URL"] ?? "http://localhost:3000",
  },
});