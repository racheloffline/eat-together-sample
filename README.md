# About

This is a sample version of the Eat Together App (https://www.eat-together.tech/) for display purposes. It does not correspond to the code for the full app for security reasons and is connected to a different firestore database. Thus, this sample has limited functionality but still showcases the core features of Eat Together.

The purpose of Eat Together is to connect students through food. We have built an app that matches students based on their schedules and interests to spontaneously share meals. We hope that by bringing people together over something that is so universal, we can spark all kinds of meaningful conversations.

# Getting Started ✨✨✨

## Navigating the Repository

The majority of development will be happening in the `src` folder. Inside the `src` folder, there are other subfolders:
1. `components`: contains files for our app's self-made components (e.g. buttons, icons, text containers, etc.). Make sure you use them as much as possible! And feel free to create your own :)
2. `navigation`: contains files related to how you navigate around the app as well as authenticating users.
3. `provider`: contains Firebase-related files.
4. `screens`: all of the app's pages are located here! Most of your work will be done here. Any questions about this subdirectory can be directed to Rachel, Eric, or Arya!

There are also some miscellaneous JS scripts (e.g. `allTags.js`) in `src`:
1. `allTags.js` + `eventTags.js` + `foodTags.js` + `schoolTags.js` + `hobbyTags.js`: lists of all the user/event tags in the system.
2. `getDate.js` + `getTime.js`: returns strings of the date and time, respectively, of JS Date objects.
3. `methods.js`: various miscellaneous methods for the app. Make sure to check it out!
4. `profaneWords.js`: a list of profane words (used for filtering user inputs in the app) 😳
5. `timeSlots.js`: contains a list of time slots (used for scheduling in the app).

Other (less but kinda) important files/folders to know:
1. `assets`: contains static images for the app (e.g. logo, stock images).
2. `node_modules`: contains all downloaded libraries for the app (including default React Native stuff). DON'T TOUCH!
3. `.gitignore`: contains a list of files to ignore when pushing to git.
4. `package.json` + `yarn.lock`: contains information about libraries/dependencies the app needs to run (`npm install` and `yarn.lock` rely on this file).


## How to Run this App Locally 🚀

1. Install [node.js](https://nodejs.org/en/). To ensure that you properly downloaded it, type `npm -v` in the terminal. This will diplsay the currently installed version, if any.
2. Install Expo:

   ```jsx
   npm install --global expo-cli
   ```

3. Clone this repo.
4. In the home/main directory of this repo, install all required libraries/dependencies:

   ```jsx
   npm install
   ```
   for mac users who are unable to use npm, use yarn instead:
   ```
   npm install --global yarn
   yarn install
   ```
5. To link this project with Firebase, download the `.env` file from our [Google Drive](https://drive.google.com/drive/folders/1eOrcYGYxwPWrVTMVeQIACACIpNpj3vNb). Simply put it in the root directory.
6. Start the environment:

   ```jsx
   npm start
   ```
   or start directly from expo:
   ```
   expo start
   ```
   for yarn users, use the following command:
   ```
   yarn start
   ```
   
7. Get the expo mobile app (https://expo.dev/client) and scan the generated QR code with the app.
