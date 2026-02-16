import 'dotenv/config';

export default {
  expo: {
    name: 'PuhAlbum',
    slug: 'puhalbum-mobile',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff'
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.puhalbum.mobile',
      infoPlist: {
        NSPhotoLibraryUsageDescription: 'Приложению нужен доступ к фотографиям для загрузки изображений',
        NSCameraUsageDescription: 'Приложению нужен доступ к камере для создания фотографий',
        ITSAppUsesNonExemptEncryption: false
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff'
      },
      package: 'com.puhalbum.mobile',
      permissions: [
        'READ_EXTERNAL_STORAGE',
        'WRITE_EXTERNAL_STORAGE',
        'CAMERA'
      ]
    },
    web: {
      favicon: './assets/favicon.png'
    },
    extra: {
      eas: {
        projectId: 'b761ca00-bd85-449a-bbf6-26c5e63e7d71'
      },
      apiUrl: 'https://puhalbum.com'
    },
    owner: "annamu",
    // keep single slug definition above
  }
};
