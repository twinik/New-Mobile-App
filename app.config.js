import 'dotenv/config';

export default{
  "expo": {
    "name": "AG Field WorkForce",
    "slug": "AG Field WorkForce",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/agnitu_logo.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/agnitu_logo.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "updates": {
      "fallbackToCacheTimeout": 0
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "bundleIdentifier": "com.render.agnitufwf",
      "supportsTablet": true
    },
    "android": {
      "package": "com.render.agnitufwf",
      "versionCode": 2,
      "adaptiveIcon": {
        "foregroundImage": "./assets/agnitu_logo.png",
        "backgroundColor": "#FFFFFF"
      },
      "config": {
        "googleMaps": {
          "apiKey": "YOUR GOOGLE MAP API KEY HERE"
        }
      }
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    extra: {
      apiKey: process.env.API_KEY,
      authDomain: process.env.AUTH_DOMAIN,
      projectId: process.env.PROJECT_ID,
      storageBucket: process.env.STORAGE_BUCKET,
      messagingSenderId: process.env.MESSAGING_SENDER_ID,
      appId: process.env.APP_ID,
      GOOGLE_MAPS_KEY:process.env.GOOGLE_MAPS_KEY
    }

  }
}
