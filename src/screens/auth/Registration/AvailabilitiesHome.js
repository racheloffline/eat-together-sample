// Homepage for the availabilities screen (where you choose between linking with GCalendar or entering manually)

import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { Layout } from "react-native-rapi-ui";

import LargeText from "../../../components/LargeText";
import MediumText from "../../../components/MediumText";
import NormalText from "../../../components/NormalText";
import Button from "../../../components/Button";

import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import {
  GOOGLE_AUTH_CLIENT_ID,
  GOOGLE_AUTH_CLIENT_ID_ANDROID,
  GOOGLE_AUTH_CLIENT_ID_IOS
} from "@env"; //Enviroment variables

WebBrowser.maybeCompleteAuthSession();

const AvailabilitiesHome = props => {
  const [accessToken, setAccessToken] = useState(null);
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: GOOGLE_AUTH_CLIENT_ID,
    iosClientId: GOOGLE_AUTH_CLIENT_ID_IOS,
    androidClientId: GOOGLE_AUTH_CLIENT_ID_ANDROID,
    scopes: ["https://www.googleapis.com/auth/calendar"]
  });

  useEffect(() => {
    async function fetchData() {
      if (response?.type === 'success') {
        const accessToken = response.authentication.accessToken;
        const calendar = await fetchCalendar(accessToken);
        console.log(calendar);
      }
    }
    
    fetchData();
  }, [response]);

  const fetchCalendar = async (accessToken) => {
    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/users/me/calendarList?access_token=${accessToken}`,
      {
        method: "GET",
        headers: new Headers({
          Authorization: `Bearer ${accessToken}`,
        }),
      }
    )
      .then(function (res) {
        return res.json();
      })
      .then(function (res) {
        return res.items;
      });
    
    return response;
  }

  return (
    <Layout style={styles.page}>
        <LargeText center>Preferred eating times!</LargeText>
        <NormalText center>This is to help suggest meals/meetups that meet your schedule.</NormalText>

        <View style={styles.main}>
            <Button disabled={!request} marginVertical={10} onPress={() => promptAsync()}>Link with Google Calendar</Button>
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