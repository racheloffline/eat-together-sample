//Functionality TDB, most likely to be used to implement ice-breaker games

import React, {useEffect, useState} from "react";
import {View, StyleSheet, Image, Dimensions, ScrollView} from "react-native";
import {
  Layout,
  TopNav,
} from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";

import LargeText from "../../components/LargeText";
import MediumText from "../../components/MediumText";
import TagsList from "../../components/TagsList";
import Button from "../../components/Button";
import EventCard from "../../components/EventCard";
import NormalText from "../../components/NormalText";

import { db } from "../../provider/Firebase";
import firebase from "firebase";

const FullProfile = ({ route, navigation }) => {
  const [status, setStatus] = useState("Loading");
  const [disabled, setDisabled] = useState(true);
  const [color, setColor] = useState("grey");
  const [image, setImage] = useState(null);
  const [events, setEvents] = useState([]);
  const [inviterImage, setInviterImage] = useState("https://static.wixstatic.com/media/d58e38_29c96d2ee659418489aec2315803f5f8~mv2.png");

  useEffect(() => { // updates stuff right after React makes changes to the DOM
    const user = firebase.auth().currentUser;
    // STEP 1: Check if user is on your connections list.
    let thisUser = db.collection("Users").doc(user.uid);
    thisUser.get().then((doc) => {
      let thisData = doc.data();
      // Save some images
      if (thisData.hasImage) {
        setInviterImage(thisData.image);
      }
      
      let requestedUser = db.collection("Users").doc(route.params.person.id);

      requestedUser.get().then((doc) => {
        let data = doc.data();

        if (thisData.friendIDs.includes(data.id)) {
          setDisabled(true);
          setStatus("Taste Buds");
          setColor("gold")
        } else {
          // STEP 2: Check if you have already requested to connect with user.
          const ref = db.collection("User Invites").doc(data.id).collection("Connections").doc(user.uid);
          ref.get().then((doc) => {
            if (doc.exists) {
              setDisabled(true);
              setStatus("Request Sent");
              setColor("grey");
            } else {
              // STEP 3: Check if user has already requested to follow you.
              const otherRef = db.collection("User Invites").doc(user.uid).collection("Connections").doc(data.id);
              otherRef.get().then((doc) => {
                if (doc.exists) {
                  setDisabled(true);
                  setStatus("Check Requests");
                  setColor("orange");
                } else {
                  // STEP 4: Set to default
                  setDisabled(false);
                  setStatus("Add Taste Bud");
                  setColor("#5DB075");
                }
              });
            }
          });
        }
      });
    }).then(() => {
      let list = [];
      db.collection("Public Events").onSnapshot(query => {
        query.forEach(doc => {
          if (doc.data().hostID === route.params.person.id
            && doc.data().date.toDate() > new Date()) {
            list.push(doc.data());
          }
        });

        setEvents(list);
      });
    });
  }, []);
  
  // Method for sending a connection request
  const connect = () => {
    const user = firebase.auth().currentUser;
    let requestedUser = db.collection("Usernames").doc(route.params.person.username);
    requestedUser.get().then((doc) => {
      let data = doc.data();
      db.collection("Users").doc(user.uid).get().then((curUser) => {
        let userData = curUser.data();
        db.collection("User Invites").doc(data.id).collection("Connections").doc(user.uid).set({
          name: (userData.firstName + " " + userData.lastName),
          username: userData.username,
          profile: inviterImage
        }).then(() => {
          setStatus("Request Sent");
          setDisabled(true);
          setColor("grey");
        });
      });
    });
  }

  return (
    <Layout>
      <TopNav middleContent={
          <MediumText center>View Profile</MediumText>
        }
        leftContent={
          <Ionicons
            name="chevron-back"
            size={20}
          />
        } leftAction={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.page}>
        <View style={styles.background}/>
        <Image style={styles.image} source={route.params.person.hasImage ? 
          {uri: route.params.person.image} : require("../../../assets/logo.png")}/>
        
        <View style={styles.name}>
          <LargeText>
            {route.params.person.firstName + " " + route.params.person.lastName}
          </LargeText>
          <MediumText size={16}>@{route.params.person.username}</MediumText>

          <View style={{flexDirection: "row", marginVertical: 10}}>
            <Button disabled={disabled} onPress={connect} backgroundColor={color}
              paddingVertical={5} paddingHorizontal={15} fontSize={14}>
              {status}
            </Button>
            <Button onPress={() => {
              navigation.navigate("ReportPerson", {
                user: route.params.person
              });
            }} backgroundColor="red" paddingVertical={5} 
            paddingHorizontal={15}  fontSize={14}>
              Report
            </Button>
          </View>

          <NormalText>
          {route.params.person.attendedEventIDs.length + "/" + 
            (route.params.person.archivedEventIDs.length + route.params.person.attendingEventIDs.length) + " meals attended"}
          </NormalText>
        </View>

        <TagsList tags={route.params.person.tags}/>
        <MediumText>{route.params.person.bio}</MediumText>

        <View style={styles.cards}>
          {events.map((event) => <EventCard event={event} key={event.id} click={() => {
            navigation.navigate("FullCard", {
              event
            });
          }}/>)}
        </View>
      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  page: {
    paddingTop: 30,
    alignItems: "center",
    paddingHorizontal: 10,
  },

  background: {
    position: "absolute",
    width: Dimensions.get('screen').width,
    height: 100,
    backgroundColor: "#5DB075"
  },

  image: {
    width: 125,
    height: 125,
    borderColor: "white",
    borderWidth: 3,
    borderRadius: 125,
    backgroundColor: "white"
  },

  name: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10
  },

  cards: {
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 40
  },
});

export default FullProfile;