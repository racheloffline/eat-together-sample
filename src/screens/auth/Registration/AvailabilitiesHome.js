// Homepage for the availabilities screen (where you choose between linking with GCalendar or entering manually)

import React, { useState, useEffect } from "react";
import { View, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { Layout } from "react-native-rapi-ui";

import LargeText from "../../../components/LargeText";
import MediumText from "../../../components/MediumText";
import NormalText from "../../../components/NormalText";
import Button from "../../../components/Button";

import { getFreeTimes } from "../../../methods";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import {
  GOOGLE_AUTH_CLIENT_ID,
  GOOGLE_AUTH_CLIENT_ID_ANDROID,
  GOOGLE_AUTH_CLIENT_ID_IOS
} from "@env"; //Enviroment variables

WebBrowser.maybeCompleteAuthSession();

const AvailabilitiesHome = props => {

  const [freeTimes, setFreeTimes] = useState([]); // List of user's available times
  const [loading, setLoading] = useState(false); // Loading state

  return (
    <Layout style={styles.page}>
        {loading && (
          <View style={styles.overlay}>
            <ActivityIndicator size={100} color="#5DB075"/>
          </View>
        )}

        <LargeText center>Preferred eating times!</LargeText>
        <NormalText center>This is to help suggest meals/meetups that meet your schedule.</NormalText>

        <View style={styles.main}>
            <Button marginVertical={10} onPress={() => props.navigation.navigate("Availabilities")}>Enter manually</Button>
        </View>

        <View style={styles.buttons}>
          <Button onPress={() => props.navigation.goBack()}
            marginHorizontal={10} backgroundColor="white"
            color="#5DB075">Back</Button>
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

  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 10
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