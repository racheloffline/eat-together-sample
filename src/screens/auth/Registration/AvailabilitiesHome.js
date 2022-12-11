// Homepage for the availabilities screen (where you choose between linking with GCalendar or entering manually)

import React from "react";
import { View, StyleSheet } from "react-native";
import { Layout } from "react-native-rapi-ui";

import LargeText from "../../../components/LargeText";
import MediumText from "../../../components/MediumText";
import NormalText from "../../../components/NormalText";
import Button from "../../../components/Button";

const AvailabilitiesHome = props => {
  return (
    <Layout style={styles.page}>
        <LargeText center>Preferred eating times!</LargeText>
        <NormalText center>This is to help suggest meals/meetups that meet your schedule.</NormalText>

        <View style={styles.main}>
            <Button marginVertical={10}>Link with Google Calendar</Button>
            <MediumText center>OR</MediumText>
            <Button marginVertical={10} onPress={() => props.navigation.navigate("Availabilities")}>Enter manually</Button>
        </View>

        <View style={styles.buttons}>
          <Button onPress={() => props.navigation.goBack()}
            marginHorizontal={10}>Back</Button>
          <Button onPress={() => props.navigation.navigate("Email")}
            marginHorizontal={10}>Skip</Button>
        </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  page: {
    paddingHorizontal: 20,
    paddingTop: 30
  },

  main: {
    flex: 0.75,
    paddingHorizontal: 40,
    marginTop: 20,
    justifyContent: "center"
  },

  buttons: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center"
  }
});

export default AvailabilitiesHome;