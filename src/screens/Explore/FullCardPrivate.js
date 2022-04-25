//Functionality TDB, most likely to be used to implement ice-breaker games

import React from "react";
import { View, StyleSheet, Image } from "react-native";
import {
  Layout,
  TopNav,
  Text,
  themeColor,
  useTheme,
  Button
} from "react-native-rapi-ui";
import LargeText from "../../components/LargeText";
import MediumText from "../../components/MediumText";
import NormalText from "../../components/NormalText";
import { Ionicons } from "@expo/vector-icons";

const FullCard = ({ route, navigation }) => {
    let attendees = ""
    route.params.event.attendees.forEach(person => {
        if (person != route.params.hostID) {
            attendees += person + " ";
        }
    });
  return (
    <Layout>
      <TopNav
        middleContent="View Event"
        leftContent={
          <Ionicons
            name="chevron-back"
            size={20}
          />
        }
        leftAction={() => navigation.goBack()}
      />
      <View style={styles.page}>
        <LargeText>{route.params.event.name}</LargeText>
        <MediumText>Hosted by: {route.params.event.hostID}</MediumText>
          <MediumText>Attendees: {attendees}</MediumText>
        <View style={styles.details}>
            <Image style={styles.image}
              source={{uri: route.params.event.image}}/>

            <View style={{flexDirection: "column"}}>
                <NormalText>{route.params.event.date}</NormalText>
                <NormalText>{route.params.event.time}</NormalText>
                <NormalText>{route.params.event.location}</NormalText>
            </View>
        </View>

        <Text size="h4">{route.params.event.details}</Text>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
    page: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 10
    },

    details: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      marginVertical: 40
    },

    image: {
      marginRight: 20,
      width: 150,
      height: 150,
      borderRadius: 30,
    },
});

export default FullCard;