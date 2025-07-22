import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.c40e046a546e4fc59f30162180f9561e',
  appName: 'rdeye-recode-system',
  webDir: 'dist',
  server: {
    url: 'https://c40e046a-546e-4fc5-9f30-162180f9561e.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0
    }
  }
};

export default config;