// Specify availabilities for days of the week

import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";

import LargeText from "../../../components/LargeText";
import NormalText from "../../../components/NormalText";
import Button from "../../../components/Button";

const Availabilities = props => {
  return (
    <ScrollView style={styles.page}>
<<<<<<< HEAD
        <LargeText center size={28}>Mark your availabilities</LargeText>
        <NormalText center>Or feel free to do this later :)</NormalText>
=======
        <LargeText center size={28}>Mark when you'd like to eat!</LargeText>
        <NormalText center>Or feel free to do this later.</NormalText>
>>>>>>> josh_june_25th

        <View style={styles.dates}>
            <Button onPress={() => props.navigation.navigate("Day", {
              times: props.monday,
              setTimes: props.setMonday,
              day: "Monday"
            })} marginVertical={5}>Monday</Button>
            <Button onPress={() => props.navigation.navigate("Day", {
              times: props.tuesday,
              setTimes: props.setTuesday,
              day: "Tuesday"
            })} marginVertical={5}>Tuesday</Button>
            <Button onPress={() => props.navigation.navigate("Day", {
              times: props.wednesday,
              setTimes: props.setWednesday,
              day: "Wednesday"
            })} marginVertical={5}>Wednesday</Button>
            <Button onPress={() => props.navigation.navigate("Day", {
              times: props.thursday,
              setTimes: props.setThursday,
              day: "Thursday"
            })} marginVertical={5}>Thursday</Button>
            <Button onPress={() => props.navigation.navigate("Day", {
              times: props.friday,
              setTimes: props.setFriday,
              day: "Friday"
            })} marginVertical={5}>Friday</Button>
            <Button onPress={() => props.navigation.navigate("Day", {
              times: props.saturday,
              setTimes: props.setSaturday,
              day: "Saturday"
            })} marginVertical={5}>Saturday</Button>
            <Button onPress={() => props.navigation.navigate("Day", {
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

export default Availabilities;