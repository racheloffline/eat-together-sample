//Functionality TDB, most likely to be used to implement ice-breaker games

import React, { useState, useEffect } from "react";
import { View, StyleSheet, Image } from "react-native";
import {
  Layout,
  TopNav,
  Text
} from "react-native-rapi-ui";
import LargeText from "../../components/LargeText";
import MediumText from "../../components/MediumText";
import NormalText from "../../components/NormalText";
import Button from "../../components/Button";
import { Ionicons } from "@expo/vector-icons";

import getDate from "../../getDate";
import getTime from "../../getTime";

import { db, auth } from "../../provider/Firebase";
import * as firebase from "firebase";

const FullCard = ({ route, navigation }) => {
  const user = auth.currentUser;
  const [host, setHost] = useState(null);
  const [attending, setAttending] = useState(false);

  useEffect(() => {
    db.collection("Users").doc(route.params.event.hostID).get().then(doc => {
      setHost(doc.data());
    });

    db.collection("Users").doc(user.uid).get().then(doc => {
      if (doc.data().attendingEventIDs.includes(route.params.event.id)) {
        setAttending(true);
      }
    })
  }, []);

  const attend = () => {
    db.collection("Users").doc(user.uid).update({
      attendingEventIDs: firebase.firestore.FieldValue.arrayUnion(route.params.event.id),
      eventsSignedUp: firebase.firestore.FieldValue.increment(1)
    });

    navigation.goBack();
    alert("You are signed up :)");
  }

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
        <MediumText center>Hosted by: {host ? host.name : "Person"}</MediumText>
        <View style={styles.details}>
            <Image style={styles.image}
              source={route.params.event.image ? {uri: route.params.event.image} : require("../../../assets/logo.png")}/>

            <View style={{flexDirection: "column"}}>
                <NormalText>{getDate(route.params.event.date.toDate())}</NormalText>
                <NormalText>{getTime(route.params.event.date.toDate())}</NormalText>
                <NormalText>{route.params.event.location}</NormalText>
            </View>
        </View>

        <Text size="h4">{route.params.event.additionalInfo}</Text>
        <Button onPress={attend} disabled={attending} marginVertical={40}>
          {attending ? "Signed Up!" : "Attend!"}
        </Button>
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