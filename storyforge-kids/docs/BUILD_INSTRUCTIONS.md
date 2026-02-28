# Story Forge Kids - Android Build Instructions

Complete step-by-step guide to build and deploy the Story Forge Kids Android app.

## Prerequisites

### Required Software
- **Android Studio** (latest version - download from https://developer.android.com/studio)
- **Java Development Kit (JDK)** 11 or higher
- **Android SDK** with API level 24+ (installed via Android Studio)
- **Gradle** 8.1.0+ (comes with Android Studio)

### System Requirements
- **RAM**: Minimum 4GB (8GB recommended)
- **Disk Space**: 5GB+ for SDK and build files
- **OS**: Windows, macOS, or Linux

## Step 1: Install Android Studio

1. Download Android Studio from https://developer.android.com/studio
2. Run the installer and follow the setup wizard
3. Choose "Standard" installation
4. Accept the Android SDK licenses when prompted
5. Wait for the SDK components to download and install

## Step 2: Open the Project

1. Launch Android Studio
2. Click "Open an Existing Project"
3. Navigate to the `story-forge-kids-android` folder
4. Click "Open"
5. Wait for Gradle to sync (this may take 2-5 minutes on first load)

## Step 3: Configure the Web App URL

1. Open `app/src/main/java/com/storyforge/kids/MainActivity.kt`
2. Find the `loadWebApp()` function
3. Update the URL to your deployed web app:

```kotlin
private fun loadWebApp() {
    val webAppUrl = "https://your-deployed-url.com"  // Change this
    webView.loadUrl(webAppUrl)
}
```

## Step 4: Build the App

### Debug Build (for testing)

1. In Android Studio, click **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
2. Wait for the build to complete
3. You'll see a notification: "Build successful"
4. Click "Locate" to find the APK file

**Location**: `app/build/outputs/apk/debug/app-debug.apk`

### Release Build (for distribution)

#### 4a. Create a Keystore (first time only)

1. In Android Studio, click **Build** → **Generate Signed Bundle / APK**
2. Select "APK"
3. Click "Create new..." next to Keystore path
4. Fill in the form:
   - **Keystore path**: Choose a location (e.g., `~/keystore.jks`)
   - **Password**: Create a strong password (remember this!)
   - **Confirm**: Re-enter password
   - **Alias**: `key`
   - **Password**: Same as keystore password
   - **Validity (years)**: 25
   - **Certificate** section: Fill in your information
5. Click "OK"

#### 4b. Build Release APK

1. In Android Studio, click **Build** → **Generate Signed Bundle / APK**
2. Select "APK"
3. Click "Next"
4. Select your keystore file and enter credentials
5. Click "Next"
6. Select "release" build variant
7. Check "V1 (Jar Signature)" and "V2 (Full APK Signature)"
8. Click "Finish"
9. Wait for the build to complete

**Location**: `app/build/outputs/apk/release/app-release.apk`

## Step 5: Test on Emulator

### Create Virtual Device

1. In Android Studio, click **Tools** → **Device Manager**
2. Click "Create Device"
3. Select a device (e.g., "Pixel 6")
4. Click "Next"
5. Select API level 30 or higher
6. Click "Next" → "Finish"

### Run App on Emulator

1. Select your virtual device from the device dropdown
2. Click the green "Run" button (or press Shift+F10)
3. Wait for the emulator to start and the app to install
4. The app will launch automatically

## Step 6: Test on Physical Device

### Enable Developer Mode

1. Go to **Settings** → **About Phone**
2. Tap "Build Number" 7 times
3. Go back to **Settings** → **Developer Options**
4. Enable "USB Debugging"
5. Connect your device via USB

### Install App

1. Connect your Android device via USB
2. In Android Studio, select your device from the dropdown
3. Click the green "Run" button
4. The app will install and launch on your device

## Step 7: Publish to Google Play

### Prepare for Release

1. Update version number in `app/build.gradle`:
   ```gradle
   versionCode 2  // Increment this
   versionName "1.0.1"  // Update this
   ```

2. Build a release APK (follow Step 4b)

### Create Google Play Account

1. Go to https://play.google.com/console
2. Sign in with your Google account
3. Create a new app
4. Fill in app details:
   - App name: "Story Forge Kids"
   - Default language: English
   - App type: Application
   - Category: Education

### Upload to Google Play

1. In Google Play Console, go to **Release** → **Production**
2. Click "Create new release"
3. Upload your signed APK
4. Fill in release notes
5. Review and confirm
6. Submit for review

**Note**: First submission takes 24-48 hours for review.

## Troubleshooting

### Gradle Sync Fails
- **Solution**: Click "File" → "Invalidate Caches" → "Invalidate and Restart"

### Build Fails with "SDK not found"
- **Solution**: 
  1. Click "Tools" → "SDK Manager"
  2. Install API 34 and Build Tools 34.0.0
  3. Click "Apply" → "OK"

### App Crashes on Launch
- **Solution**:
  1. Check the web app URL is correct
  2. Verify device has internet connection
  3. Check logcat for errors: **View** → **Tool Windows** → **Logcat**

### "Keystore file not found"
- **Solution**: Create a new keystore following Step 4a

### APK Installation Fails
- **Solution**:
  1. Uninstall previous version: `adb uninstall com.storyforge.kids`
  2. Reinstall the APK

## Command Line Build (Alternative)

If you prefer to build from command line:

### Debug Build
```bash
cd story-forge-kids-android
./gradlew assembleDebug
```

### Release Build
```bash
export KEYSTORE_PASSWORD="your_password"
export KEY_ALIAS="key"
export KEY_PASSWORD="your_password"
./gradlew assembleRelease
```

## Useful Commands

```bash
# List connected devices
adb devices

# Install APK
adb install app/build/outputs/apk/debug/app-debug.apk

# Uninstall app
adb uninstall com.storyforge.kids

# View logs
adb logcat | grep StoryForge

# Clear app data
adb shell pm clear com.storyforge.kids
```

## Next Steps

1. **Customize App Icon**: Replace `app/src/main/res/mipmap-*/ic_launcher.png`
2. **Update Splash Screen**: Edit `app/src/main/res/layout/activity_splash.xml`
3. **Configure Analytics**: Add Firebase or your preferred analytics
4. **Add Push Notifications**: Integrate Firebase Cloud Messaging

## Support

For issues:
1. Check the troubleshooting section above
2. Review Android Studio's logcat output
3. Visit https://developer.android.com/docs for Android documentation
4. Check the main Story Forge Kids project documentation

## Version History

- **v1.0.0** (Initial Release)
  - WebView wrapper for web app
  - Splash screen
  - Permission handling
  - Back button navigation
