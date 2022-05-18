//Functionality TDB, most likely to be used to implement ice-breaker games

import React, {useEffect, useState} from "react";
import {View, ScrollView, StyleSheet, Image, Dimensions, TouchableOpacityComponent} from "react-native";
import {
  Layout,
  TopNav,
} from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";

import LargeText from "../../components/LargeText";
import MediumText from "../../components/MediumText";
import TagsList from "../../components/TagsList";
import SmallText from "../../components/SmallText";
import {TouchableOpacity} from "react-native";
import {db} from "../../provider/Firebase";
import firebase from "firebase";

const FullProfile = ({ route, navigation }) => {
  const [status, setStatus] = useState("Loading");
  const [disabled, setDisabled] = useState(true);
  const [color, setColor] = useState("grey");

  useEffect(() => { // updates stuff right after React makes changes to the DOM
    const user = firebase.auth().currentUser;
    // STEP 1: Check if user is on your connections list.
    let thisUser = db.collection("Users").doc(user.uid);
    thisUser.get().then((doc) => {
      let thisData = doc.data();
      let requestedUser = db.collection("Usernames").doc(route.params.person.username);
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
                  setColor("orange")
                } else {
                  // STEP 4: Set to default
                  setDisabled(false);
                  setStatus("Add Taste Bud");
                  setColor("#5DB075")
                }
              });
              }
            });
          }
        });
      });
    }, []);

  return (
    <Layout>
      <TopNav
        middleContent={
          <MediumText center>User Profile</MediumText>
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
        <View style={styles.background}/>
        <Image style={styles.image}
          source={{uri: route.params.person.image}}/>
        <View style={styles.name}>
          <LargeText>{route.params.person.name}</LargeText>
          <View style={{flexDirection: "row"}}>
          <TouchableOpacity disabled={disabled} onPress={() => {
            const user = firebase.auth().currentUser;
            let requestedUser = db.collection("Usernames").doc(route.params.person.username);
            requestedUser.get().then((doc) => {
              let data = doc.data();
              db.collection("Users").doc(user.uid).get().then((curUser) => {
                let userData = curUser.data();
                db.collection("User Invites").doc(data.id).collection("Connections").doc(user.uid).set({
                  name: userData.name,
                  username: userData.username
                }).then(() => {
                  setStatus("Request Sent");
                  setDisabled(true);
                  setColor("grey");
                }
                );
              });
            });
          }}>
            <View style={[styles.connect, {backgroundColor: color}]}>
              <SmallText color={"white"} size={15}>{status}</SmallText>
            </View>
          </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              navigation.navigate("Report", {
                user: route.params.person
              });
            }}>
              <View style={styles.report}>
                <SmallText color={"white"} size={15}>Report</SmallText>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <TagsList tags={route.params.person.tags}/>

        <MediumText>"{route.params.person.quote}"</MediumText>

      </View>
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
    width: 100,
    height: 100,
    borderColor: "white",
    borderWidth: 3,
    borderRadius: 50
  },

  connect: {
    width: 150,
    height: 25,
    borderRadius: 25,
    alignItems: "center"
  },

  name: {
    alignItems: "center",
    marginVertical: 20
  },
  report: {
    backgroundColor: "red",
    borderRadius: 25,
    alignItems: "center",
    height: 25,
    width: 70,
  }
});

export default FullProfile;