// What your event will look like

import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Layout, TopNav } from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";

import Attendance from "../../components/Attendance";
import Icebreaker from "../../components/Icebreaker";
import TagsList from "../../components/TagsList";
import Button from "../../components/Button";

import LargeText from "../../components/LargeText";
import MediumText from "../../components/MediumText";
import NormalText from "../../components/NormalText";

import getDate from "../../getDate";
import getTime from "../../getTime";
import { db, storage, auth } from "../../provider/Firebase";
import * as firebase from "firebase";
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from "react-native-popup-menu";

const FullCard = ({ route, navigation }) => {
  // Data for the attendees
  const [attendees, setAttendees] = useState(
    new Array(route.params.event.attendees.length).fill(false)
  );
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(false);

  // For tracking opening and closing
  const [openAttendance, setOpenAttendance] = useState(false);
  const [openIcebreakers, setOpenIcebreakers] = useState(false);

  // List of icebreaker questions
  const [icebreakers, setIcebreakers] = useState([]);

  // Get the current user
  const user = auth.currentUser;

  useEffect(() => {
    if (icebreakers && icebreakers.length === 0) {
      fetchIcebreakers();
    }

    if (route.params.event.hostID === user.uid) {
      getAttendees();
    }
  }, []);

  // Mark an attendee absent or present
  const markAttendee = (index) => {
    let newAttendees = [...attendees];
    newAttendees[index] = !newAttendees[index];
    setAttendees(newAttendees);

    const storeID = {
      type: route.params.event.type,
      id: route.params.event.id,
    };

    db.collection("Users")
      .doc(people[index].id)
      .update({
        attendedEventIDs: newAttendees[index]
          ? firebase.firestore.FieldValue.arrayUnion(storeID)
          : firebase.firestore.FieldValue.arrayRemove(storeID),
      });
  };

  // TODO: JOSH | Randomize this
  // Fetch icebreaker questions from FIREBASE
  const fetchIcebreakers = () => {
    const eventID = route.params.event.id;

    if (route.params.event.type === "private") {
        db.collection("Private Events")
          .doc(eventID)
          .get()
          .then((doc) => {
            setIcebreakers(doc.data().ice);
            console.log("icebreakers:");
            console.log(doc.data().ice);
          });
    }
    else {
        db.collection("Public Events")
          .doc(eventID)
          .get()
          .then((doc) => {
            setIcebreakers(doc.data().ice);
            console.log("da ice ice baby!:");
            console.log(doc.data().ice);
          });
    }
  };

  // Fetch all attendees of this event
  const getAttendees = () => {
    route.params.event.attendees.forEach((attendee, index) => {
      if (attendee !== user.uid) {
        db.collection("Users")
          .doc(attendee)
          .get()
          .then((doc) => {
            const data = doc.data();

            const ids = data.attendedEventIDs.map((e) => e.id);
            if (ids.includes(route.params.event.id)) {
              let newAttendees = attendees;
              newAttendees[index] = true;
              setAttendees(newAttendees);
            }

            if (data.hasImage) {
              storage
                .ref("profilePictures/" + data.id)
                .getDownloadURL()
                .then((uri) => {
                  data.image = uri;
                })
                .then(() => setPeople((people) => [...people, data]));
            } else {
              setPeople((people) => [...people, data]);
            }
          });
      }
    });
  };

  //Delete the event; this is the old action
  function withdraw() {
    if (!loading) {
      setLoading(true);
      route.params.deleteEvent(route.params.event.id);

      const storeID = {
        type: route.params.event.type,
        id: route.params.event.id,
      };

      db.collection("Users")
        .doc(user.uid)
        .update({
          attendingEventIDs: firebase.firestore.FieldValue.arrayRemove(storeID),
        })
        .then(() => {
          if (route.params.event.type === "private") {
            db.collection("Private Events")
              .doc(route.params.event.id)
              .update({
                attendees: firebase.firestore.FieldValue.arrayRemove(user.uid),
              })
              .then(() => {
                alert("You withdrew from the event");
                navigation.goBack();
              });
          } else {
            db.collection("Public Events")
              .doc(route.params.event.id)
              .update({
                attendees: firebase.firestore.FieldValue.arrayRemove(user.uid),
              })
              .then(() => {
                alert("You withdrew from the event");
                navigation.goBack();
              });
          }
        });
    }
  }

  //Reporting event function
  function reportEvent() {
    navigation.navigate("ReportEvent", {
      eventID: route.params.event.id,
    });
  }

  return (
    <Layout>
      <TopNav
        middleContent={
          <MediumText center>{route.params.event.name}</MediumText>
        }
        leftContent={
          <Ionicons
            name="chevron-back"
            color={loading ? "grey" : "black"}
            size={20}
          />
        }
        leftAction={() => navigation.goBack()}
        rightContent={
          <View>
            <Menu>
              <MenuTrigger>
                <Ionicons
                  name="ellipsis-horizontal"
                  color={loading ? "grey" : "black"}
                  size={20}
                />
              </MenuTrigger>
              <MenuOptions>
                {route.params.event.hostID !== user.uid && <MenuOption onSelect={() => reportEvent()}>
                  <NormalText size={18}>Report Event</NormalText>
                </MenuOption>}
                {route.params.event.hostID === user.uid && <MenuOption onSelect={() => navigation.navigate("EditEvent", {
                  event: route.params.event
                })}>
                  <NormalText size={18}>Edit Event</NormalText>
                </MenuOption>}
                <MenuOption onSelect={() => withdraw()}>
                  <NormalText size={18} color="red">
                    Withdraw
                  </NormalText>
                </MenuOption>
              </MenuOptions>
            </Menu>
          </View>
        }
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

          {/* Icebreakers dropdown */}

          <View style={styles.row}>
            <TouchableOpacity
              onPress={() => setOpenIcebreakers(!openIcebreakers)}
            >
              <Ionicons
                name={
                  !openIcebreakers ? "caret-forward-sharp" : "caret-down-sharp"
                }
                size={20}
                color="black"
              />
            </TouchableOpacity>
            <NormalText paddingHorizontal={7} size={17} color="black">
              Icebreakers
            </NormalText>
          </View>
          <View style={styles.icebreakers}>
            {openIcebreakers && icebreakers &&
              icebreakers.map((ice, index) => (
                <Icebreaker number={index + 1} icebreaker={ice} key={index} />
              ))}
          </View>

          {/* Attendance dropdown */}
          {route.params.event.hostID === user.uid && <View>
            <View style={styles.row}>
              <TouchableOpacity
                onPress={() => setOpenAttendance(!openAttendance)}
              >
                <Ionicons
                  name={
                    !openAttendance ? "caret-forward-sharp" : "caret-down-sharp"
                  }
                  size={20}
                  color="black"
                />
              </TouchableOpacity>

              <NormalText paddingHorizontal={7} size={17} color="black">
                Attendance
              </NormalText>
            </View>

            {openAttendance && (
              <View style={{ marginTop: 10 }}>
                {people.length === 0 ? (
                  <NormalText paddingHorizontal={25} size={17} color="black">
                    {"Just yourself ;)"}
                  </NormalText>
                ) : (
                  people.map((person, index) => (
                    <Attendance
                      size={17}
                      person={person}
                      key={person.id}
                      attending={attendees[index]}
                      onPress={() => markAttendee(index)}
                    />
                  ))
                )}
              </View>
            )}
          </View>}
        </View>
      </ScrollView>
    </Layout>
  );
};

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

  icebreakers: {
    textAlign: "left",
    marginBottom: 20,
    paddingHorizontal: 25,
  },

  logistics: {
    marginVertical: 15,
  },
});

export default FullCard;
