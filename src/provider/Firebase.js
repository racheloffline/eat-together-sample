import firebase from "firebase/compat";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";

import { initializeAuth, getReactNativePersistence} from "firebase/auth/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// This is a sample so it uses an empty database that is ok to share.
// Normally this would be configured with a .env
const firebaseConfig = {
  apiKey: "AIzaSyAfhnwUKt0-vMT0Y_YfJORIGLuI8Uqg0lg",
  authDomain: "eat-together-sample.firebaseapp.com",
  projectId: "eat-together-sample",
  storageBucket: "eat-together-sample.appspot.com",
  messagingSenderId: "109775466326",
  appId: "1:109775466326:web:ccd8d1218203926d5ef0f7",
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