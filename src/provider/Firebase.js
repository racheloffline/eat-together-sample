import firebase from "firebase";

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

if (firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig);
}

export const db = firebase.firestore();
export const auth = firebase.auth();
export const storage = firebase.storage();