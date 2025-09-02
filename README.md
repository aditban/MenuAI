# 🍽️ Dishlingo Android App

A native Android application that provides a seamless mobile experience for Dishlingo - your AI-powered restaurant menu decoder.

## ✨ Features

- **🌐 WebView Integration** - Runs your Dishlingo web app natively
- **📱 Native Android Experience** - Full-screen, responsive design
- **📷 Camera Integration** - Direct access to device camera for menu photos
- **🖼️ Gallery Access** - Select existing menu images from device
- **🔒 Permission Management** - Proper handling of camera and storage permissions
- **⚡ Performance Optimized** - Fast loading and smooth navigation
- **🎨 Modern UI** - Material Design 3 with Dishlingo branding

## 🚀 Quick Start

### Prerequisites

- **Android Studio** (latest version)
- **Android SDK** (API 24+)
- **Java 8** or higher
- **Your Dishlingo Vercel URL**

### Setup Steps

1. **Clone/Download** this project
2. **Open in Android Studio**
3. **Update URL** in `MainActivity.java`:
   ```java
   private static final String DISHLINGO_URL = "https://your-actual-dishlingo.vercel.app";
   ```
4. **Sync Gradle** and build the project
5. **Run on device/emulator**

## 📱 Building & Deployment

### Debug Build
```bash
./gradlew assembleDebug
```

### Release Build
```bash
./gradlew assembleRelease
```

### APK Location
Generated APK will be in:
```
app/build/outputs/apk/release/app-release.apk
```

## 🔧 Requirements

- **Minimum SDK**: API 24 (Android 7.0)
- **Target SDK**: API 34 (Android 14)
- **Compile SDK**: API 34
- **Java Version**: 8+

---

**Made with ❤️ for Dishlingo** 