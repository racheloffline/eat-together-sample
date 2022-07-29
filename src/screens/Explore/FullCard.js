//Functionality TDB, most likely to be used to implement ice-breaker games

import React, { useState, useEffect } from "react";
import { View, ScrollView, StyleSheet, ImageBackground } from "react-native";
import { Layout, TopNav } from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";

import LargeText from "../../components/LargeText";
import MediumText from "../../components/MediumText";
import NormalText from "../../components/NormalText";
import Button from "../../components/Button";
import TagsList from "../../components/TagsList";
import DarkContainer from "../../components/DarkContainer";

import getDate from "../../getDate";
import getTime from "../../getTime";

import {db, auth} from "../../provider/Firebase";
import * as firebase from "firebase";


const FullCard = ({ route, navigation }) => {
  const user = auth.currentUser;

  const [attending, setAttending] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    db.collection("Users").doc(user.uid).get().then(doc => {
      const events = doc.data().attendingEventIDs.map(e => e.id);

      if (events.includes(route.params.event.id)) {
        setAttending(true);
      }
    }).then(() => {
      setLoading(false);
    })
  }, []);

  // Attend an event
  const attend = () => {
    const storeID = {
      type: "public",
      id: route.params.event.id
    };

    db.collection("Users").doc(user.uid).update({
      attendingEventIDs: firebase.firestore.FieldValue.arrayUnion(storeID)
    }).then(() => {
      db.collection("Public Events").doc(route.params.event.id).update({
        attendees: firebase.firestore.FieldValue.arrayUnion(user.uid)
      }).then(() => {
        navigation.goBack();
        alert("You are signed up :)");
      });
    });
  }

  // Withdraw from an event you initially attended
  const withdraw = () => {
    const storeID = {
      type: "public",
      id: route.params.event.id
    };

    db.collection("Users").doc(user.uid).update({
      attendingEventIDs: firebase.firestore.FieldValue.arrayRemove(storeID)
    }).then(() => {
      db.collection("Public Events").doc(route.params.event.id).update({
        attendees: firebase.firestore.FieldValue.arrayRemove(user.uid)
      }).then(() => {
        navigation.goBack();
        alert("You withdrew :(");
      });
    });
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
      <ScrollView contentContainerStyle={styles.page}>
        <LargeText center>{route.params.event.name}</LargeText>
        <MediumText center>Hosted by: {route.params.event.hostFirstName ? 
          route.params.event.hostFirstName + " " + route.params.event.hostLastName.substring(0, 1) + "."
          : route.params.event.hostName}</MediumText>

        {route.params.event.tags && <TagsList tags={route.params.event.tags}/>}

        <ImageBackground style={styles.image} imageStyle={{ borderRadius: 10 }}
          source={route.params.event.hasImage ? {uri: route.params.event.image}
            : {uri: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?crop=entropy&cs=tinysrgb&fm=jpg&ixlib=rb-1.2.1&q=60&raw_url=true&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8Zm9vZHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=1400"}}>

          <View style={styles.logistics}>
            <DarkContainer align="flex-start">
              <NormalText color="white">{getDate(route.params.event.date.toDate())}</NormalText>
              <NormalText color="white">{getTime(route.params.event.date.toDate())}</NormalText>
              <NormalText color="white">{route.params.event.location}</NormalText>
            </DarkContainer>
          </View>
        </ImageBackground>

        <NormalText>{route.params.event.additionalInfo}</NormalText>
        <Button onPress={attending ? withdraw : attend} disabled={route.params.event.hostID === user.uid}
        marginVertical={20} backgroundColor={loading ? "grey" : attending && 
          route.params.event.hostID !== user.uid ? "red" : false}>
          {loading ? "Loading ..." : route.params.event.hostID === user.uid ? "Your event :)" :
            attending ? "Withdraw :(" : "Attend!"}
        </Button>
      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
    page: {
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 10
    },

    image: {
      width: 300,
      height: 350,
      marginVertical: 20
    },

    logistics: {
      position: "absolute",
      bottom: 10,
      left: 10,
      maxWidth: 150,
    }
});

export default FullCard;