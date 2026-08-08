import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.xufinance.app',
  appName: 'Xu Finance',
  webDir: '.output/public',
  server: {
    url: 'https://xufinance.netlify.app', // Trỏ trực tiếp về trang Netlify
    cleartext: true
  }
};

export default config;