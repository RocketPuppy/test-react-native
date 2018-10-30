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
