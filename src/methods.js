import {db} from "./provider/Firebase";
import firebase from "firebase";
import profaneWords from "./profaneWords";

/*
Generates a random color.
Returns: Hex value of random color.
 */
export const generateColor = () => {
    const colors = ["#5DB075", "#6DE2BF", "#62E286", "#31B87F", "#71D8AC", "#3DD671"];
    let random = Math.floor(Math.random() * colors.length);
    return colors[random];
};

/*
Gets a list of the top 5 profiles suggestions based on the current user and tags.
Returns: A list of usernames of the top 5 user suggestions.
 */
export const getProfileRecs = () => {
    const user = firebase.auth().currentUser; // You can access properties from this variable
    // Store current user data
    // Array of distances between currentUser tags and tags of every other user
    let distances = [];
    // Maps of distances and names of other users
    let otherUsers = new Map();
    // Create string consisting of currentUser's tags concatenated together
    let a = "";
    db.collection("Users").doc(user.uid).get().then((aDoc) => {
        let aData = aDoc.data();
        let aTags = aData.tags;
        aTags.forEach((tag) => {
            a += tag;
        });
    }).then(() => {
        db.collection("Users").get().then(snapshot => {
            snapshot.docs.forEach(doc => { // Gets every doc with data for every other user
                let b = "";
                let data = doc.data() // gets all the data in that doc
                let tags = data.tags
                let username = data.username
                tags.forEach((tag) => {
                    b += tag;
                });
                let count = 0;
                // Lines 43-68 is the algorithm that determines which users tags are the best match
                // I used the levenshtein algorithm (calculates similarity in spelling rather than
                // semantic similarity-- will work on programming something that computes semantic similarity
                // but this should suffice for now!)
                if (a.length === 0) return b.length;
                if (b.length === 0) return a.length;

                let matrix = [];

                let i;
                for (i = 0; i <= b.length; i++) {
                    matrix[i] = [i];
                }

                let j;
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
                distances.push(matrix[b.length][a.length]);
                otherUsers[matrix[b.length][a.length]] = username;
                ++count;
            });
        });
    })
    distances.sort((a,b)=>a-b); 
    let bestUsers = [];
    // Store usernames of other users with lowest distance between current user's tags
    for (let i = 0; i < 5; i++) {
        bestUsers.push(otherUsers[distances[i]]);
    }
    // best users is a string array returning users from the first best match to the fifth
    return bestUsers; 
}

/*
Determines if an event is in the morning, afternoon, or evening.
Returns: "morning", "afternoon", or "evening".
 */
export const getTimeOfDay = (time) => {
    let hour = time.getHours();
    if (hour < 12) {
        return "morning";
    } else if (hour < 17) {
        return "afternoon";
    } else {
        return "evening";
    }
}
/*
Check whether inappropriate words are used.
Returns: true if inappropriate words are used, false otherwise.
 */
export const checkProfanity = word => {
    const profane = profaneWords.some(w => word.toLowerCase().includes(w));
    return profane;
}

/*
Determines if a user is available for a particular event/meal.
 */
export const isAvailable = (user, event) => {
    const date = (event.date instanceof Date) ? event.date : event.date.toDate();
    const hour = date.getHours();

    switch (new Date(date).getDay()) { // Days of the week
        case 0: // Sunday
            return isMatch(hour, user.availabilities.sunday);
        case 1: // Monday
            return isMatch(hour, user.availabilities.monday);
        case 2: // Tuesday
            return isMatch(hour, user.availabilities.tuesday);
        case 3: // Wednesday
            return isMatch(hour, user.availabilities.wednesday);
        case 4: // Thursday
            return isMatch(hour, user.availabilities.thursday);
        case 5: // Friday
            return isMatch(hour, user.availabilities.friday);
        case 6: // Saturday
            return isMatch(hour, user.availabilities.saturday);
    }
}

/*
Helper function to determine if a user's schedule matches with an event/meal.
 */
const isMatch = (hour, availabilities) => {
    let result = false;
    availabilities.forEach(availability => {
        if (availability.startTime.toDate().getHours() === hour) {
            if (availability.available) {
                result = true;
            }

            return;
        }
    });

    return result;
}