# Running

Make sure you have XCode version >=9.4. Install the XCode command line tools from the Preferences -> Locations panel in XCode. React Native also requires Node version >= 8.3. [Watchman](https://facebook.github.io/watchman) is also recommended.

To run the app for iOS run:

```
react-native run-ios
```

You can also open the AwesomeProject.xcodeproj file in XCode and tell XCode to
run the project.

## Configuring the Simulator

Use the following command to list all simulators available.

```
xcrun simctl list devices
```

Use the `--simulator` flag when running via command line to select a different simulator.

```
react-native run-ios --simulator="iPad"
```

## Configuring AppCenter

When setting up the project to build on AppCenter, these instructions were
followed: https://docs.microsoft.com/en-us/appcenter/build/react-native/ios. If
you have linked libraries using CocoaPods, you should commit the Pods directory
and the XCworkspace **before** configuring the build. If done after configuring
the build then delete the configuration and reconfigure.

See https://docs.microsoft.com/en-us/appcenter/build/ios/code-signing for code
signing instructions.
