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
//  const [monday, setMonday] = useState(null);
//  const [tuesday, setTuesday] = useState(cloneDeep(timeSlots));
//  const [wednesday, setWednesday] = useState(cloneDeep(timeSlots));
//  const [thursday, setThursday] = useState(cloneDeep(timeSlots));
//  const [friday, setFriday] = useState(cloneDeep(timeSlots));
//  const [saturday, setSaturday] = useState(cloneDeep(timeSlots));
//  const [sunday, setSunday] = useState(cloneDeep(timeSlots));

  return (
    <ScrollView style={styles.page}>
        <LargeText center size={28}>Mark your availabilities</LargeText>
        <NormalText center>Or feel free to do this later :)</NormalText>

        <View style={styles.dates}>
            <Button onPress={() => props.navigation.navigate("EditDay", {
              times: monday,
              setTimes: setMonday,
              day: "Monday"
            })} marginVertical={5}>Monday</Button>
            <Button onPress={() => props.navigation.navigate("EditDay", {
              times: props.tuesday,
              setTimes: props.setTuesday,
              day: "Tuesday"
            })} marginVertical={5}>Tuesday</Button>
            <Button onPress={() => props.navigation.navigate("EditDay", {
              times: props.wednesday,
              setTimes: props.setWednesday,
              day: "Wednesday"
            })} marginVertical={5}>Wednesday</Button>
            <Button onPress={() => props.navigation.navigate("EditDay", {
              times: props.thursday,
              setTimes: props.setThursday,
              day: "Thursday"
            })} marginVertical={5}>Thursday</Button>
            <Button onPress={() => props.navigation.navigate("EditDay", {
              times: props.friday,
              setTimes: props.setFriday,
              day: "Friday"
            })} marginVertical={5}>Friday</Button>
            <Button onPress={() => props.navigation.navigate("EditDay", {
              times: props.saturday,
              setTimes: props.setSaturday,
              day: "Saturday"
            })} marginVertical={5}>Saturday</Button>
            <Button onPress={() => props.navigation.navigate("EditDay", {
              times: props.sunday,
              setTimes: props.setSunday,
              day: "Sunday"
            })} marginVertical={5}>Sunday</Button>
        </View>

        <View style={styles.buttons}>
          <Button onPress={() => props.navigation.goBack()}
            marginHorizontal={10}>Back</Button>
          <Button onPress={() => props.navigation.navigate("Password")}
            marginHorizontal={10}>Next</Button>
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