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

import {db, auth, storage} from "../../provider/Firebase";
import * as firebase from "firebase";

const FullCard = ({ route, navigation }) => {
  const user = auth.currentUser;
  const [host, setHost] = useState(null);
  const [attending, setAttending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState("");

  useEffect(() => {
    if (route.params.event.hasImage) {
      storage.ref("eventPictures/" + route.params.event.id).getDownloadURL().then(uri => {
        setImage(uri);
      });
    }

    db.collection("Users").doc(route.params.event.hostID).get().then(doc => {
      setHost(doc.data());
    });

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
      <View style={styles.page}>
        <LargeText center>{route.params.event.name}</LargeText>
        <MediumText center>Hosted by: {host ? host.name : "Person"}</MediumText>
        <View style={styles.details}>
            <Image style={styles.image}
              source={image ? {uri: image} : {uri: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?crop=entropy&cs=tinysrgb&fm=jpg&ixlib=rb-1.2.1&q=60&raw_url=true&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8Zm9vZHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=1400"}}/>

            <View style={{flexDirection: "column"}}>
                <NormalText>{getDate(route.params.event.date.toDate())}</NormalText>
                <NormalText>{getTime(route.params.event.date.toDate())}</NormalText>
                <NormalText>{route.params.event.location}</NormalText>
            </View>
        </View>

        <Text size="h4">{route.params.event.additionalInfo}</Text>
        <Button onPress={attending ? withdraw : attend} disabled={route.params.event.hostID === user.uid}
        marginVertical={40} backgroundColor={loading ? "grey" : attending && 
          route.params.event.hostID !== user.uid ? "red" : false}>
          {loading ? "Loading" : route.params.event.hostID === user.uid ? "Your event :)" :
            attending ? "Withdraw :(" : "Attend!"}
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