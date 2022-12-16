/**
 * @param {Array} list of events
 * Given a list of events, return a list of free times for each of Monday to Sunday (multiple free times per day are possible)
 */
export const getFreeTimes = (events) => {
    let freeTimes = [];

    // Do this for each day of the week
    for (let i = 1; i <= 7; i++) {
        const currDayEvents = events.filter((e) => e.dayOfWeek === i).sort((a, b) => a.start - b.start);            

        // Set the start and end times for the day
        let startTime, endTime;

        // If there are no events on this day, add the entire day to the list of free times
        if (currDayEvents.length === 0) {
            startTime = new Date();
            startTime.setHours(9);
            startTime.setMinutes(0);
            endTime = new Date();
            endTime.setHours(21);
            endTime.setMinutes(0);

            freeTimes.push({
                dayOfWeek: i,
                start: startTime,
                end: endTime
            });
        } else {
            startTime = new Date(currDayEvents[0].start);
            startTime.setHours(9);
            startTime.setMinutes(0);
            startTime.setSeconds(0);
            endTime = new Date(currDayEvents[0].start);
            endTime.setHours(21);
            endTime.setMinutes(0);
            endTime.setSeconds(0);

            let currIndex = 0;
            while (currIndex < currDayEvents.length) {
                const currEvent = currDayEvents[currIndex];

                // If the event starts after the current time, add the free time to the list
                if (currEvent.start > startTime) {
                    let end = currEvent.start;
                    end.setMinutes(currEvent.start.getMinutes() - 15);

                    freeTimes.push({
                        dayOfWeek: i,
                        start: startTime,
                        end: currEvent.start
                    });
                }

                // Set the start time to the end time of the event
                startTime = currEvent.end;
                startTime.setMinutes(currEvent.end.getMinutes() + 15);
                currIndex++;
            }

            // If the last event ends before the end of the day, add the free time to the list
            if (startTime < endTime) {
                freeTimes.push({
                    dayOfWeek: i,
                    start: startTime,
                    end: endTime
                });
            }
        }
    }

    return freeTimes;
}