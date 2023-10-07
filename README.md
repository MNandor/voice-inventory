# Voice Inventory

Mobile app that detects voice commands and arguments.
`react-native`

## Expo

This app uses Expo and [Development Builds](https://docs.expo.dev/workflow/customizing/).
Native directories are left out of the Git repository, but they can be generated using `npx expo prebuild`.
Running the app using `npx expo run:[android|iOS]` does this automatically.

Note that running the app either requires Android Studio and the SDK, or Xcode and macOS.

Basic testing can be done using `expo start --[android|iOS]` but this uses the Expo Go app, which is not supported by the voice recognition library.

## Voice Recognition

The app uses [React Native Voice](https://github.com/react-native-voice/voice), licensed under MIT (open-source).

The library needs to be installed using `npm i @react-native-voice/voice --save`.

## How to Run

Commands in order:

- `npm i @react-native-voice/voice --save` (run once)
- `npx expo run:iOS`