// Full recommendation page

import React, { useState, useEffect } from "react";
import { View, ScrollView, StyleSheet, Dimensions, Image } from "react-native";
import { Layout, TopNav } from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";

import LargeText from "../../components/LargeText";
import MediumText from "../../components/MediumText";
import NormalText from "../../components/NormalText";

import Container from "../../components/Container";
import Button from "../../components/Button";
import TagsList from "../../components/TagsList";
import Link from "../../components/Link";

import getDate from "../../getDate";
import getTime from "../../getTime";

import {db, auth} from "../../provider/Firebase";
import * as firebase from "firebase/compat";
import openMap from "react-native-open-maps";

const Recommendation = ({ route, navigation }) => {
  const user = auth.currentUser;
  const [attendees, setAttendees] = useState([]);

  useEffect(() => {
    route.params.event.suggestedAttendees.forEach(attendee => {
        db.collection("Users").doc(attendee).get().then(doc => {
            setAttendees(prev => [...prev, doc.data()]);
        });
    });
  }, []);

  // Confirm attendance to recommended meetup
  const attend = () => {
    const storeID = {
      type: "recommendation",
      id: route.params.event.id
    };

    db.collection("Users").doc(user.uid).update({
      attendingEventIDs: firebase.firestore.FieldValue.arrayUnion(storeID)
    }).then(() => {
      db.collection("Recommendations").doc(route.params.event.id).update({
        attendees: firebase.firestore.FieldValue.arrayUnion(user.uid)
      }).then(() => {
        navigation.goBack();
        alert("You are signed up :)");
      });
    });
  }

  return (
    <Layout>
      <TopNav
        middleContent={
          <MediumText center>Recommendation</MediumText>
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
        <View style={styles.infoContainer}>
          <NormalText center marginBottom={10}>Based on your interests and availability ...</NormalText>
          
          <Container>
            <View style={styles.row}>
                <LargeText size={24} marginBottom={10}>
                    {route.params.event.name}
                </LargeText>
                <MediumText size={24}> with:</MediumText>
            </View>

            {/* 3 meetup details (location, date, time} are below */}

            <View style={styles.logistics}>
                <View style={styles.row}>
                    <Link onPress={() => openMap({ query: route.params.event.name, provider: "google" })}>
                        View location on map
                    </Link>
                </View>

                <View style={styles.row}>
                <Ionicons name="calendar-outline" size={20} />
                <NormalText paddingHorizontal={10} color="black">
                    {route.params.event.startDate ? getDate(route.params.event.startDate.toDate()) : getDate(route.params.event.date.toDate())}
                </NormalText>
                </View>

                <View style={styles.row}>
                <Ionicons name="time-outline" size={20} />
                <NormalText paddingHorizontal={10} color="black">
                    {route.params.event.startDate ? getTime(route.params.event.startDate.toDate()) : getTime(route.params.event.date.toDate())}
                    {route.params.event.endDate && " - ".concat(getTime(route.params.event.endDate.toDate()))}
                </NormalText>
                </View>
            </View>
          </Container>
        </View>
      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  infoContainer: {
    marginHorizontal: 30,
    marginBottom: 50,
    marginTop: 20
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
    flexWrap: "wrap"
  },

  profileImg: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderColor: "#5DB075",
    borderWidth: 1,
    backgroundColor: "white",
    marginRight: 3
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

export default Recommendation;