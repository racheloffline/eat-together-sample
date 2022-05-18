import {db} from "./provider/Firebase";
import firebase from "firebase";
import { intersection } from "lodash";

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
    const user = firebase.auth().currentUser; // You can access properties from this variable
    // Store current user data
    // Array of distances between currentUser tags and tags of every other user
    var distances = []; 
    // Maps of distances and names of other users
    Map<int, String> otherUsers == new HashMap(); 
    // Create string consisting of currentUser's tags concatenated together
    var a = "";
    let aDoc = currentUser.docs()
    let aData = aDoc.data()
    let aTags = aData.tags
    aTags.forEach((tag) => {
    a += tag; 
    }); 
    const allUsers = db.collection("Users").get().then(snapshot => {
        snapshot.docs.forEach(doc => { // Gets every doc with data for every other user
        var b = ""; 
        let data = doc.data() // gets all the data in that doc
        let tags = data.tags
        let username = data.username
        tags.forEach((tag) => {
        b += tag;
        }); 
        var count = 0; 
        // Lines 43-68 is the algorithm that determines which users tags are the best match
        // I used the levenshtein algorithm (calculates similarity in spelling rather than 
        // semantic similarity-- will work on programming something that computes semantic similarity
        // but this should suffice for now!) 
            if (a.length === 0) return b.length; 
            if (b.length === 0) return a.length;
        
            var matrix = [];
        
            var i;
            for (i = 0; i <= b.length; i++) {
            matrix[i] = [i];
            }

            var j;
            for (j = 0; j <= a.length; j++) {
            matrix[0][j] = j;
            }
        
            for (i = 1; i <= b.length; i++) {
            for (j = 1; j <= a.length; j++) {
                if (b.charAt(i-1) == a.charAt(j-1)) {
                matrix[i][j] = matrix[i-1][j-1];
                } else {
                matrix[i][j] = Math.min(matrix[i-1][j-1] + 1, 
                                        Math.min(matrix[i][j-1] + 1, 
                                                matrix[i-1][j] + 1)); 
                }
            }
            }
            // input distance information into map and array
            distances[count] = matrix[b.length][a.length];
            otherUsers.put(matrix[b.length][a.length], username); 
            ++count; 
        })
    })
    distances.sort((a,b)=>a-b); 
    var bestUsers = []; 
    // Store usernames of other users with lowest distance between current user's tags
    for (i = 0; i < 5; i++) {
        bestUsers[i] = otherUsers.get(distances[i]);
    }
    // best users is a string array returning users from the first best match to the fifth
    return bestUsers; 
}