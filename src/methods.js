import {db} from "./provider/Firebase";
import firebase from "firebase/compat";
import profaneWords from "./profaneWords";

/**
 * Generates a random color.
 * Returns: Hex value of random color.
 */
export const generateColor = () => {
    const colors = ["#5DB075", "#6DE2BF", "#62E286", "#31B87F", "#71D8AC", "#3DD671"];
    let random = Math.floor(Math.random() * colors.length);
    return colors[random];
};

/**
 * Determines if an event is in the morning, afternoon, or evening.
 * Returns: "morning", "afternoon", or "evening".
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

/**
 * Check whether inappropriate words are used.
 * Returns: true if inappropriate words are used, false otherwise.
 */
export const checkProfanity = word => {
    const profane = profaneWords.some(w => word.toLowerCase().includes(w));
    return profane;
}

/**
 * Determines if a user is available for a particular event/meal.
 */
export const isAvailable = (user, event) => {
    let date;
    if (event.startDate) {
        date = (event.startDate instanceof Date) ? event.startDate : event.startDate.toDate();
    } else {
        date = (event.date instanceof Date) ? event.date : event.date.toDate();
    }
    
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

/**
 * Helper function to determine if a user's schedule matches with an event/meal.
 * Returns: true if match, false if not.
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

/**
 * Randomly chooses three elements from an array.
 * Returns: An array of three random elements.
 */
export const randomize3 = (array) => {
    let result = [];
    let copy = array.slice();
    for (let i = 0; i < 3; i++) {
        let index = Math.floor(Math.random() * copy.length);
        result.push(copy[index]);
        copy.splice(index, 1);
    }

    return result;
}

/**
 * Compares two dates.
 * Returns: an integer representing if the first date is before (-), after (+), or equal (0) to the second date.
 */
export const compareDates = (a, b) => {
    let aSeconds;
    if (a.date) {
        aSeconds = a.date.seconds;
    } else {
        aSeconds = a.startDate.seconds;
    }

    let bSeconds;
    if (b.date) {
        bSeconds = b.date.seconds;
    } else {
        bSeconds = b.startDate.seconds;
    }

    return aSeconds - bSeconds;
}