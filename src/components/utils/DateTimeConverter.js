
//USELESS AS OF NOW
class DateTimeConverter {

    static toDate(dateObject) {
        let totalSeconds = (dateObject.nanoseconds * 1000000) + dateObject.seconds;
        let toHours = totalSeconds
        return new Date();
    }

    static getDate(date) {
        let month = date.getMonth();
        let day = date.getDay();
        let year = date.getFullYear();
        let monthAsString;
        let dayAsString;

        switch (month) {
            case 0:
                monthAsString = "January";
                break;
            case 1:
                monthAsString = "February";
                break;
            case 2:
                 monthAsString = "March";
                 break;
            case 3:
                monthAsString = "April";
                break;
            case 4:
                monthAsString = "May";
                break;
            case 5:
                monthAsString = "June";
                break;
            case 6:
                monthAsString = "July";
                break;
            case 7:
                monthAsString = "August";
                break;
            case 8:
                monthAsString = "September";
                break;
            case 9:
                monthAsString = "October";
                break;
            case 10:
                monthAsString = "November";
                break;
            case 11:
                monthAsString = "December";
                break;
            default:
                monthAsString = "UNKNOWN MONTH";
                break;
        }

        if(day % 10 == 1) {
            dayAsString = day + "st";
        } else if(day % 10 == 2) {
            dayAsString = day + "nd";
        } else if(day % 10 == 3) {
            dayAsString = day + "rd";
        } else {
            dayAsString = day + "th";
        }

        return monthAsString + " " + dayAsString + ", " + year;
    }

    static getTime(date) {

    }
}

export default DateTimeConverter;