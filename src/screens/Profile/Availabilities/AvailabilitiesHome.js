// FOR JOSH: homepage for availabilities, figure out how to fetch the user's availabilities

import React, {useState} from "react";
import { View, ScrollView, StyleSheet } from "react-native";

import LargeText from "../../../components/LargeText";
import NormalText from "../../../components/NormalText";
import Button from "../../../components/Button";

import EditDay from "./EditDay";
import timeSlots from "../../../timeSlots";

import { cloneDeep } from "lodash";

const AvailabilitiesHome = props => {
  // Days
  console.log("mondah 7 am availability: " + props.route.params.monday.monday[0].available);
  const [monday, setMonday] = useState(props.route.params.monday);
  const [tuesday, setTuesday] = useState(props.route.params.tuesday);
  const [wednesday, setWednesday] = useState(props.route.params.wednesday);
  const [thursday, setThursday] = useState(props.route.params.thursday);
  const [friday, setFriday] = useState(props.route.params.friday);
  const [saturday, setSaturday] = useState(props.route.params.saturday);
  const [sunday, setSunday] = useState(props.route.params.sunday);

  return (
    <ScrollView style={styles.page}>
        <LargeText center size={28}>Mark your availabilities</LargeText>
        <NormalText center>Or feel free to do this later :)</NormalText>

        <View style={styles.dates}>
            <Button onPress={() => props.navigation.navigate("EditDay", {
              times: monday.monday,
              setTimes: setMonday,
              day: "Monday"
            })} marginVertical={5}>Monday</Button>
            <Button onPress={() => props.navigation.navigate("EditDay", {
              times: tuesday.tuesday,
              setTimes: setTuesday,
              day: "Tuesday"
            })} marginVertical={5}>Tuesday</Button>
            <Button onPress={() => props.navigation.navigate("EditDay", {
              times: wednesday.wednesday,
              setTimes: setWednesday,
              day: "Wednesday"
            })} marginVertical={5}>Wednesday</Button>
            <Button onPress={() => props.navigation.navigate("EditDay", {
              times: thursday.thursday,
              setTimes: setThursday,
              day: "Thursday"
            })} marginVertical={5}>Thursday</Button>
            <Button onPress={() => props.navigation.navigate("EditDay", {
              times: friday.friday,
              setTimes: setFriday,
              day: "Friday"
            })} marginVertical={5}>Friday</Button>
            <Button onPress={() => props.navigation.navigate("EditDay", {
              times: saturday.saturday,
              setTimes: setSaturday,
              day: "Saturday"
            })} marginVertical={5}>Saturday</Button>
            <Button onPress={() => props.navigation.navigate("EditDay", {
              times: sunday.sunday,
              setTimes: setSunday,
              day: "Sunday"
            })} marginVertical={5}>Sunday</Button>
        </View>

        <View style={styles.buttons}>
          <Button onPress={() => props.navigation.goBack()}
            marginHorizontal={10}>Back</Button>
          <Button onPress={() => props.navigation.navigate("Password")}
            marginHorizontal={10}>Save</Button>
        </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    paddingHorizontal: 20,
    paddingVertical: 30
  },

  dates: {
    paddingHorizontal: 40,
    marginTop: 20,
    marginBottom: 50
  },

  buttons: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center"
  }
});

export default AvailabilitiesHome;
