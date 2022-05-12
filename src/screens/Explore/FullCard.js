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

import getDate from "../../getDate";
import getTime from "../../getTime";

const FullCard = ({ route, navigation }) => {
  return (
    <Layout>
      <TopNav
        middleContent={
          <MediumText center>View Event</MediumText>
        }
        leftContent={
          <Ionicons
            name="chevron-back"
            size={20}
          />
        }
        leftAction={() => navigation.goBack()}
      />
      <View style={styles.page}>
        <LargeText center>{route.params.event.name}</LargeText>
        <MediumText center>Hosted by: {route.params.event.hostID}</MediumText>
        <View style={styles.details}>
            <Image style={styles.image}
              source={{uri: route.params.event.image}}/>

            <View style={{flexDirection: "column"}}>
                <NormalText>{getDate(route.params.event.date.toDate())}</NormalText>
                <NormalText>{getTime(route.params.event.date.toDate())}</NormalText>
                <NormalText>{route.params.event.location}</NormalText>
            </View>
        </View>

        <Text size="h4">{route.params.event.details}</Text>
        <Button text="Attend!" status="success" style={{marginTop: 40}}/>
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