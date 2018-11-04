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

## Configuring CodePush

Follow these directions
https://docs.microsoft.com/en-us/appcenter/distribution/codepush/. You will need
to create deployments to get through all of the setup. You can do that in the
CodePush UI as described here
https://docs.microsoft.com/en-us/appcenter/distribution/codepush/using-ui. See
https://docs.microsoft.com/en-us/appcenter/distribution/codepush/react-native#plugin-usage
for specific information about the CodePush integration with React Native. Pay
special attention to the options available to the higher-order component, `codePush`.

## Configuring Typescript

Follow these directions https://github.com/Microsoft/TypeScript-React-Native-Starter

`apollo-client`, `aws-appsync`, `aws-appsync-react`, `react-apollo` all come
with Typescript definitions directly. `aws-sdk`, `react`, `react-native`, `jest`
all have type definitions available. `graphql-tag` recommends using
`ts-transform-graphql-tag` instead if done via Typescript. `babel-jest`
recommends using `ts-jest` if using Typescript.

There is a problem with the `aws-sdk` package. It relies on some NodeJS types
and pulls in the `@types/node` package. A React Native environment does not
provide precisely the same types. The `@types/node` package conflicts slightly
with the `@types/react-native` package, and after install the
`fix_aws_sdk_types.sh` is run that fixes the conflicting types. See that script
for links to various GitHub issues.

The `graphql` types require including the `esnext` lib in `tsconfig.json`.

The `aws-appsync` library requires types for one of its dependencies,
`@redux-offline/redux-offline`. That dependency bundles its types with the
library but because its directory structure is non-standard the Typescript
compiler needs to be told explicitly where to look for its types. Additionally
the `aws-appsync` library requires the types for its specific version of the
`apollo-react` library. While it has its own dependency, using a newer version
doesn't work.

## Configuring AppSync

Follow directions here
https://docs.aws.amazon.com/appsync/latest/devguide/building-a-client-app-reactnative.html
for a basic guide. You might need to manually install the `apollo-client`
package in addition to the other packages listed there.

## Configuring Flow

Flow had only 4 libraries available with type definitions in flow-typed. Only
`graphql-tag` was natively built with flow.
