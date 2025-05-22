import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'geoApp',
  webDir: 'www',
  plugins: {
    BackgroundGeolocation: {
      notificationTitle: 'App en segundo plano',
      notificationText: 'Rastreando ubicación...',
      interval: 10000,
      fastestInterval: 5000,
      activitiesInterval: 10000,
      stopOnTerminate: false,
      startOnBoot: true,
      smallestDisplacement: 0,
    },
  },
};

export default config;
