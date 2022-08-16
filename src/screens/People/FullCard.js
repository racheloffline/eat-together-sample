// Full event page

import React, { useState, useEffect } from "react";
import { View, ScrollView, StyleSheet, ImageBackground, Dimensions } from "react-native";
import { Layout, TopNav } from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";

import LargeText from "../../components/LargeText";
import MediumText from "../../components/MediumText";
import NormalText from "../../components/NormalText";
import Button from "../../components/Button";
import TagsList from "../../components/TagsList";

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
      
      <ScrollView>
        <ImageBackground
          source={
            route.params.event.hasImage
              ? { uri: route.params.event.image }
              : require("../../../assets/foodBackground.png")
          }
          style={styles.imageBackground}
          resizeMode="cover"
        ></ImageBackground>
        <View style={styles.infoContainer}>
          <LargeText size={20} marginBottom={10}>
            {route.params.event.name}
          </LargeText>

          <NormalText color="black">Hosted by: {route.params.event.hostID === user.uid ? "You ;)"
            : (route.params.event.hostFirstName ?
              route.params.event.hostFirstName + " " + route.params.event.hostLastName.substring(0, 1) + "."
            : route.params.event.hostName)}
          </NormalText>

          {route.params.event.tags && <TagsList marginVertical={20} tags={route.params.event.tags}/>}

          {/* 3 event details (location, date, time} are below */}

          <View style={styles.logistics}>
            <View style={styles.row}>
              <Ionicons name="location-sharp" size={20} />
              <NormalText paddingHorizontal={10} color="black">
                {route.params.event.location}
              </NormalText>
            </View>

            <View style={styles.row}>
              <Ionicons name="calendar-outline" size={20} />
              <NormalText paddingHorizontal={10} color="black">
                {getDate(route.params.event.date.toDate())}
              </NormalText>
            </View>

            <View style={styles.row}>
              <Ionicons name="time-outline" size={20} />
              <NormalText paddingHorizontal={10} color="black">
                {getTime(route.params.event.date.toDate())}
              </NormalText>
            </View>
          </View>

          <NormalText marginBottom={20} color="black">
            {route.params.event.additionalInfo}
          </NormalText>

          <Button onPress={attending ? withdraw : attend} disabled={route.params.event.hostID === user.uid}
            marginVertical={20} backgroundColor={loading ? "grey" : attending && 
              route.params.event.hostID !== user.uid ? "red" : false}>
              {loading ? "Loading ..." : route.params.event.hostID === user.uid ? "Your event :)" :
                attending ? "Withdraw :(" : "Attend!"}
          </Button>
        </View>        
      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  infoContainer: {
    marginHorizontal: 30,
    marginBottom: 50
  },

  row: {
    flexDirection: "row",
    marginVertical: 4,
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "center"
  },

  imageBackground: {
    width: Dimensions.get("screen").width,
    height: 150,
    marginBottom: 20,
  },

  logistics: {
    marginVertical: 15,
  },
});

export default FullCard;