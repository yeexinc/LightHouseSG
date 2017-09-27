# LightHouseSG
Hybrid mobile application built on [Apache Cordova](https://cordova.apache.org/docs/en/latest/) . Uses [ReactJS](https://facebook.github.io/react/) and [OnsenUI](https://onsen.io/).


## Prerequisites
- Install [NodeJS](https://nodejs.org/en/download/) as required by your machine. This allows you to run `npm` on the command line.
- Clone this repository.
- Install Apache Cordova for deploying the app for testing: `npm install -g cordova`. You may also need to install webpack globally by running `npm install -g webpack`.
- Install the other requirements as needed. Follow [this guide](https://cordova.apache.org/docs/en/latest/guide/platforms/android/index.html) if you're building for Android (you may need to install Android Studio) and [this guide](https://cordova.apache.org/docs/en/latest/guide/platforms/ios/index.html) for iOS.


## Set up
- Install the dependencies: `npm install`
- Add the Cordova platforms for development: 
`cordova platform add browser` (if you want to test on browser)
`cordova platform add android` (If you want to test on android emulator)
Refer [this page](https://cordova.apache.org/docs/en/latest/guide/cli/index.html) (under "Add Platforms") for more detailed instructions on adding platforms.

## Building the application
Whenever you make changes to the codes, the JS files have to be rebundled.
- Build the JS file with this command: `webpack`. This will output a pure JavaScript file, `bundle.js` in `www/dist/` folder.
- Serve the page on browser: `cordova emulate browser`

(Note: this has not yet been tested on Android/iOS emulator)


## Documentation links
- Apache Cordova: https://cordova.apache.org/docs/en/latest/
- React: https://facebook.github.io/react/
- Onsen UI (with React): https://onsen.io/v2/api/react/