import firebase from "firebase/compat";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";

import { initializeAuth, getReactNativePersistence} from "firebase/auth/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

//import {
//    FIREBASE_API_KEY,
//    FIREBASE_AUTH_DOMAIN,
//    FIREBASE_DATABASE_URL,
//    FIREBASE_PROJECT_ID,
//    FIREBASE_STORAGE_BUCKET,
//    FIREBASE_MESSAGING_SENDER_ID,
//    FIREBASE_APP_ID,
//} from "@env"; //Enviroment variables

//Better put your these secret keys in .env file
//Connect to firebase
const firebaseConfig = {
 apiKey: "AIzaSyDYuhOpbDxlVHBKxVz6gW45eyutD26AsGg",
 authDomain: "eat-together-303ec.firebaseapp.com",
 databaseURL: "https://eat-together-303ec.firebaseio.com",
 projectId: "eat-together-303ec",
 storageBucket: "eat-together-303ec.appspot.com",
 messagingSenderId: "856869460838",
 appId: "1:856869460838:web:01e0197a0abc9fffb686a7",
};

let app;
if (firebase.apps.length === 0) {
    app = firebase.initializeApp(firebaseConfig);
}

export const db = firebase.firestore();
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
});
export const storage = firebase.storage();