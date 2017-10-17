# LightHouseSG
Implementation of real time messaging system is done using firebase and DB stub.
![alt text](https://i.imgur.com/x0ml8.png "")


### Prerequisites
- Install [NodeJS](https://nodejs.org/en/download/) as required by your machine. This allows you to run `npm` on the command line.
- Install Apache Cordova for deploying the app for testing: `npm install -g cordova`. You may also need to install webpack globally by running `npm install -g webpack`.
- Install the other requirements as needed. Follow [this guide](https://cordova.apache.org/docs/en/latest/guide/platforms/android/index.html) if you're building for Android (you may need to install Android Studio) and [this guide](https://cordova.apache.org/docs/en/latest/guide/platforms/ios/index.html) for iOS.


### Set up
- Clone this repository using `git clone` command and switch to firebase branch. Or, you can switch to firebase branch on the top left corner of the page, then download as ZIP file and extract it.
- Navigate to the project directory and add the Cordova platforms for development: 
`cordova platform add browser` (if you want to test on browser)
`cordova platform add android` (If you want to test on android emulator)
Refer [this page](https://cordova.apache.org/docs/en/latest/guide/cli/index.html) (under "Add Platforms") for more detailed instructions on adding platforms.
- Download the `node_modules` folder [here](https://drive.google.com/open?id=0B8J8t-14cSoqMjBxZUc4RVNCZnc), extract it, and put it into the project directory. You do **not** have to run `npm install` after this.

### Building the application
Whenever you make changes to the codes, the JS files have to be rebundled.
- Build the JS file with this command: `webpack`. This will output a pure JavaScript file, `bundle.js` in `www/dist/` folder.
- Serve the page on browser: `cordova emulate browser`

(Note: this has not yet been tested on Android/iOS emulator)

### Demooooo
Things to know:
- There are two users: *Von* (a volunteer) and *Ben* (a beneficiary). You can sign in as either of them with any p/w. (Verification is done using the DB stub. If you enter a name other than Von or Ben, the app will prompt you to try again.)
- The demonstration is best done with two devices (or two browser windows), with one signed in as the volunteer and one signed in as the beneficiary.
- To host the application on two browsers, open two command prompts and run `cordova emulate browser` on both of them. (There should be two browser windows popped up with different URLs.)
- Integration of firebase is purely for demonstration purpose as of now, if you log out of the system, the new data added will be reset.
- This works with the database stub so there is already some dummy data added. To change the data, go to www > components > utilities > DBStub.js

Demonstration workflow:
1. Beneficiary: Add a new errand (The Volunteer should receive a new notification in their Notifications page)
2. Volunteer: Accept the errand (The Beneficiary should notice that the errand on their Errands page is updated with an offer)
3. Beneficiary: Accept the offer (The conclude errand button should appear, and the status of the errand should change from "Awaiting response from..." to "Submitted by..." on Volunteer's Errands page)
4. Beneficiary: Conclude the errand (The Beneficiary can then write a comment and select a rating, then submit the form)
5. After the errand has been concluded, it should disappear from both the Beneficiary's and the Volunteer's Errands page. And, the completed errand should appear on the Volunteer's and the Beneficiary's User page (select the User page at the bottom tabbar).

*** If you log out of the system halfway, all of these changes will disappear as how firebase is currently configured is such that it only listens to new events added at that particular session. This also means that we can redo the demonstration without the need to delete any new data added.

*** Functions for rejecting errands have not yet been implemented.