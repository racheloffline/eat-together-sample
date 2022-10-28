# About

Connecting students through shared meals. Our app allows you to create and join food meetups with ease.

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


## React Native Expo Installation

1. Install [node.js](https://nodejs.org/en/). To ensure that you properly downloaded it, type `npm -v` in the terminal.
2. Install Expo:

   ```jsx
   npm install --global expo-cli
   ```

3. Clone this repo.
4. In the home/main directory of this repo, install all required libraries/dependencies:

   ```jsx
   npm install
   ```
   for mac users use yarn instead:
   ```
   npm install --global yarn
   yarn install
   ```
5. To link this project with Firebase, download the `.env` file from our [Google Drive](https://drive.google.com/drive/folders/1eOrcYGYxwPWrVTMVeQIACACIpNpj3vNb). Simply put it in the root directory.
6. Start the environment:

   ```jsx
   npm start
   ```
   for mac users use yarn instead:
   ```
   yarn start
   ```
   
7. Get the expo mobile app (https://expo.dev/client) and scan the generated QR code with the app.

### Firebase Backend Setup (Ignore this section if you used the `.env` file)

- Fill this firebase config to your config inside `./src/provider/Firebase.js`
- Check out the Eat Together Google Drive for how to fill this out!

```jsx
// Better put your these secret keys in .env file
const firebaseConfig = {
	apiKey: '',
	authDomain: '',
	databaseURL: '',
	projectId: '',
	storageBucket: '',
	messagingSenderId: '',
	appId: '',
};
```

and you are good to go!

Check out https://console.firebase.google.com/u/0/ to look at our database.


### How React Navigation Auth Flow Works

The checking logged users process is inside `./src/provider/AuthProvider`.

Inside the navigator `./src/navigation/AppNavigator.js`
There are 2 stack navigators:

- `<Auth/>` → for not logged in users stack
- `<Main/>` → for logged in users stack
- `<Loading/>` → when checking if the user is logged in or not loading screen

```jsx
export default () => {
	const auth = useContext(AuthContext);
	const user = auth.user;
	return (
		<NavigationContainer>
			{user == null && <Loading />}
			{user == false && <Auth />}
			{user == true && <Main />}
		</NavigationContainer>
	);
};
```
