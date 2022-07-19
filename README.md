# Getting Started ✨✨✨

# React Native Expo Installation

1. Install [node.js](https://nodejs.org/en/)
2. Install Expo

   ```jsx
   npm install --global expo-cli
   ```

3. Clone this rep
4. Install deps on wherever you cloned this folder

   ```jsx
   npm install
   ```
   for mac users use yarn instead:
   ```
   npm install --global yarn
   yarn install
   ```
5. To link this project with Firebase, download the `.env` file from our [Google Drive](https://drive.google.com/drive/folders/1eOrcYGYxwPWrVTMVeQIACACIpNpj3vNb). Simply put it in the root directory.
6. Start the environment

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
