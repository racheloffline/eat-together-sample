# Getting Started ✨✨✨

# React Native Expo Installation

1. Install [node.js](https://nodejs.org/en/)
2. Install Expo

   ```jsx
   npm install --global expo-cli
   ```

3. Clone this repo
4. Install deps on wherever you cloned this folder

   ```jsx
   npm install
   ```

5. Start the environment

   ```jsx
   expo start
   ```
   
6. Get the expo mobile app (https://expo.dev/client) and scan the generated QR code with the app.

### Firebase Backend Setup

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
There's 2 stack navigator :

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
