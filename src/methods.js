import {db} from "./provider/Firebase";
import firebase from "firebase";

/*
Generates a random color.
Returns: Hex value of random color.
 */
export const generateColor = () => {
    const randomColor = Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, '0');
    return `#${randomColor}`;
};

/*
TODO: ELAINE
Gets a list of the top 5 profiles suggestions based on the current user and tags.
Returns: A list of usernames of the top 5 user suggestions.
 */
export const getProfileRecs = () => {
    const user = firebase.auth().currentUser;
    const allUsers = db.collection("Users");

}