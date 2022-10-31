// FOR JOSH: homepage for availabilities, figure out how to fetch the user's availabilities

import React, {useState} from "react";
import { View, ScrollView, StyleSheet } from "react-native";

import LargeText from "../../../components/LargeText";
import Button from "../../../components/Button";

import { db } from "../../../provider/Firebase";
import moment from "moment";

const AvailabilitiesHome = props => {
  // Convert Firebase timestamps in timeslots to moment objects
  const convert = day => {
    return day.map(d => ({
      startTime: !(d.startTime instanceof Date) ? moment(d.startTime.toDate()) : moment(d.startTime),
      endTime: !(d.endTime instanceof Date) ? moment(d.endTime.toDate()) : moment(d.endTime),
      available: d.available
    }));
  }

  // Days
  const [monday, setMonday] = useState(convert(props.route.params.user.availabilities.monday));
  const [tuesday, setTuesday] = useState(convert(props.route.params.user.availabilities.tuesday));
  const [wednesday, setWednesday] = useState(convert(props.route.params.user.availabilities.wednesday));
  const [thursday, setThursday] = useState(convert(props.route.params.user.availabilities.thursday));
  const [friday, setFriday] = useState(convert(props.route.params.user.availabilities.friday));
  const [saturday, setSaturday] = useState(convert(props.route.params.user.availabilities.saturday));
  const [sunday, setSunday] = useState(convert(props.route.params.user.availabilities.sunday));

  // Save edited availabilities to Firebase
  const saveAvailabilities = (day, times) => {
    let newTimes;

    switch (day) {
      case "Monday":
        newTimes = convertToDate([times, tuesday, wednesday, thursday, friday, saturday, sunday]);
        break;
      case "Tuesday":
        newTimes = convertToDate([monday, times, wednesday, thursday, friday, saturday, sunday]);
        break;
      case "Wednesday":
        newTimes = convertToDate([monday, tuesday, times, thursday, friday, saturday, sunday]);
        break;
      case "Thursday":
        newTimes = convertToDate([monday, tuesday, wednesday, times, friday, saturday, sunday]);
        break;
      case "Friday":
        newTimes = convertToDate([monday, tuesday, wednesday, thursday, times, saturday, sunday]);
        break;
      case "Saturday":
        newTimes = convertToDate([monday, tuesday, wednesday, thursday, friday, times, sunday]);
        break;
      case "Sunday":
        newTimes = convertToDate([monday, tuesday, wednesday, thursday, friday, saturday, times]);
        break;
    }

    const newAvailabilities = {
      monday: newTimes[0],
      tuesday: newTimes[1],
      wednesday: newTimes[2],
      thursday: newTimes[3],
      friday: newTimes[4],
      saturday: newTimes[5],
      sunday: newTimes[6],
    };

    db.collection("Users").doc(props.route.params.user.id).update({
      availabilities: newAvailabilities
    });

    props.route.params.updateAvailabilities(newAvailabilities);
  }

  // Convert from moment to firebase timestamp
  const convertToDate = (days) => {
    let newList = [];
    days.forEach(list => {
      let newDay = [];
      list.forEach(time => {
        newDay.push({
          startTime: time.startTime.toDate(),
          endTime: time.endTime.toDate(),
          available: time.available
        });
      });

      newList.push(newDay);
    });
    
    return newList;
  }

  return (
    <ScrollView style={styles.page}>
        <LargeText center size={28}>See/edit your preferred eating times!</LargeText>

        <View style={styles.dates}>
            <Button onPress={() => props.navigation.navigate("EditDay", {
              times: monday,
              setTimes: setMonday,
              day: "Monday",
              saveAvailabilities
            })} marginVertical={5}>Monday</Button>
            <Button onPress={() => props.navigation.navigate("EditDay", {
              times: tuesday,
              setTimes: setTuesday,
              day: "Tuesday",
              saveAvailabilities
            })} marginVertical={5}>Tuesday</Button>
            <Button onPress={() => props.navigation.navigate("EditDay", {
              times: wednesday,
              setTimes: setWednesday,
              day: "Wednesday",
              saveAvailabilities
            })} marginVertical={5}>Wednesday</Button>
            <Button onPress={() => props.navigation.navigate("EditDay", {
              times: thursday,
              setTimes: setThursday,
              day: "Thursday",
              saveAvailabilities
            })} marginVertical={5}>Thursday</Button>
            <Button onPress={() => props.navigation.navigate("EditDay", {
              times: friday,
              setTimes: setFriday,
              day: "Friday",
              saveAvailabilities
            })} marginVertical={5}>Friday</Button>
            <Button onPress={() => props.navigation.navigate("EditDay", {
              times: saturday,
              setTimes: setSaturday,
              day: "Saturday",
              saveAvailabilities
            })} marginVertical={5}>Saturday</Button>
            <Button onPress={() => props.navigation.navigate("EditDay", {
              times: sunday,
              setTimes: setSunday,
              day: "Sunday",
              saveAvailabilities
            })} marginVertical={5}>Sunday</Button>
        </View>

        <View style={styles.buttons}>
          <Button onPress={() => props.navigation.goBack()}
            marginHorizontal={10}>Back</Button>
        </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    paddingHorizontal: 20,
    paddingVertical: 20
  },

  dates: {
    paddingHorizontal: 40,
    marginTop: 20,
    marginBottom: 40
  },

  buttons: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center"
  }
});

export default AvailabilitiesHome;
