// Full recommendation page

import React, { useState, useEffect } from "react";
import { View, ScrollView, StyleSheet, Dimensions, Image, TouchableOpacity } from "react-native";
import { Layout, TopNav } from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";

import LargeText from "../../components/LargeText";
import MediumText from "../../components/MediumText";
import NormalText from "../../components/NormalText";

import Container from "../../components/Container";
import Button from "../../components/Button";
import BorderedButton from "../../components/BorderedButton";
import TagsList from "../../components/TagsList";
import Link from "../../components/Link";
import Toggle from "../../components/Toggle";

import getDate from "../../getDate";
import getTime from "../../getTime";

import {db, auth} from "../../provider/Firebase";
import * as firebase from "firebase/compat";
import openMap from "react-native-open-maps";
import { getCommonTags } from "../../methods";

const Recommendation = ({ route, navigation }) => {
  // User and other user states
  const user = auth.currentUser;
  const [attendees, setAttendees] = useState([]);
  const [commonTags, setCommonTags] = useState([]); // Common tags between the user and others

  const [openMenu, setOpenMenu] = useState(false);

  useEffect(() => {
    let existingTags = {}; // To avoid duplicates

    route.params.event.suggestedAttendees.forEach(attendee => {
        db.collection("Users").doc(attendee).get().then(doc => {
            setAttendees(prev => [...prev, doc.data()]);
            const tags = getCommonTags(route.params.userData, doc.data());
            let newTags = [];
            tags.forEach(tag => {
                if (!existingTags[tag.tag]) {
                    existingTags[tag.tag] = true;
                    newTags.push(tag);
                }
            });

            setCommonTags(prev => prev.concat(newTags));
        });
    });
  }, []);

  useEffect(() => console.log(commonTags), [commonTags]);

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
          <NormalText size={16} center marginBottom={10}>Based on your interests and availability ...</NormalText>

          <Container>
            <Image
              style={styles.image}
              source={route.params.event.hasImage ? {uri: route.params.event.image} : require("../../../assets/stockEvent.png")}
            />
            <View style={{...styles.row, "marginTop": 15}}>
                <LargeText size={24}>
                    {route.params.event.name}
                </LargeText>
                <MediumText size={24}> with:</MediumText>
            </View>

            <View style={styles.row}>
              {attendees.map((attendee, index) => 
                <TouchableOpacity style={styles.row}
                  onPress={() => {
                      navigation.navigate("FullProfile", {
                        person: attendee,
                      });
                  }}>
                  <NormalText size={16}>{index > 0 && " + "}</NormalText>
                  <Image source={attendee.hasImage ? { uri: attendee.image }
                    : require("../../../assets/logo.png")} style={styles.profileImg}/>
                  <NormalText size={16}>{attendee.firstName + " " + attendee.lastName.substring(0, 1) + "."}</NormalText>
                </TouchableOpacity>
              )}
            </View>

            <TagsList tags={commonTags}/>

            {/* 3 meetup details (location, date, time} + menu are below */}

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

            <Toggle
              open={openMenu}
              onPress={() => setOpenMenu(!openMenu)}
              title="Menu"
            />
            {route.params.event.menu.map(item => <NormalText>{item}</NormalText>)}
          </Container>

          <View style={styles.buttonRow}>
            <Button marginHorizontal={5}>Attend!</Button>
            <BorderedButton color="red" marginHorizontal={5}>Remove</BorderedButton>
          </View>
        </View>
      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 150,
    borderRadius: 10
  },

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
    width: 25,
    height: 25,
    borderRadius: 25,
    borderColor: "#5DB075",
    borderWidth: 1,
    backgroundColor: "white",
    marginRight: 3
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 30
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