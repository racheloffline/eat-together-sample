// What your event will look like

import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  Alert,
  Image
} from "react-native";
import { Layout, TopNav } from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";

import Attendance from "../../components/Attendance";
import Icebreaker from "../../components/Icebreaker";
import TagsList from "../../components/TagsList";

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
import openMap from "react-native-open-maps";

const WhileYouEat = ({ route, navigation }) => {
  // Event details
  const [event, setEvent] = useState(route.params.event);

  // Data for the attendees
  const [attendees, setAttendees] = useState([]);
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(false);

  // For tracking opening and closing
  const [openAttendance, setOpenAttendance] = useState(false);
  const [openIcebreakers, setOpenIcebreakers] = useState(false);

  // Get the current user
  const user = auth.currentUser;

  useEffect(() => {
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

  // Fetch all attendees of this event
  const getAttendees = () => {
    route.params.event.attendees.forEach((attendee) => {
      if (attendee !== user.uid) {
        db.collection("Users")
          .doc(attendee)
          .get()
          .then((doc) => {
            const data = doc.data();
            let attended = false;
            const ids = data.attendedEventIDs.map((e) => e.id);

            if (ids.includes(route.params.event.id)) {
              attended = true;
            }

            setPeople(people => [...people, data]);
            setAttendees(attendees => [...attendees, attended]);
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
          attendedEventIDs: firebase.firestore.FieldValue.arrayRemove(storeID),
        })
        .then(() => {
          if (route.params.event.type === "private") {
            db.collection("Private Events")
              .doc(route.params.event.id)
              .update({
                attendees: firebase.firestore.FieldValue.arrayRemove(user.uid),
              })
              .then(() => {
                alert("You withdrew from the meal :(");
                navigation.goBack();
              });
          } else {
            db.collection("Public Events")
              .doc(route.params.event.id)
              .update({
                attendees: firebase.firestore.FieldValue.arrayRemove(user.uid),
              })
              .then(() => {
                alert("You withdrew from the meal :(");
                navigation.goBack();
              });
          }
        });
    }
  }

  //Reporting event function
  function reportEvent() {
    navigation.navigate("ReportEvent", {
      eventID: event.id,
    });
  }

  // Replace event with new details (for editing)
  const editEvent = newEvent => {
    setEvent(newEvent);
  }

  // Alert the user if they want to withdraw from the event or not
  const withdrawAlert = () => {
    Alert.alert(
      "Withdraw",
      "Are you sure you want to withdraw from this meal?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "OK", onPress: () => withdraw() },
      ],
      { cancelable: false }
    );
  }

  return (
    <Layout>
      <TopNav
        middleContent={
          <MediumText center>{event.name}</MediumText>
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
                  size={25}
                />
              </MenuTrigger>
              <MenuOptions>
                {event.hostID !== user.uid && <MenuOption onSelect={() => reportEvent()} style={styles.option}>
                  <NormalText size={18}>Report Event</NormalText>
                </MenuOption>}
                {event.hostID === user.uid && <MenuOption onSelect={() => navigation.navigate("EditEvent", {
                  event,
                  editEvent,
                  editEvent2: route.params.editEvent
                })}  style={styles.option}>
                  <NormalText size={18}>Edit Event</NormalText>
                </MenuOption>}
                <MenuOption onSelect={() => withdrawAlert()}  style={styles.option}>
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
            event.hasImage
              ? { uri: event.image }
              : require("../../../assets/foodBackground.png")
          }
          style={styles.imageBackground}
          resizeMode="cover"
        ></ImageBackground>
        <View style={styles.infoContainer}>
          <LargeText size={20} marginBottom={10}>
            {event.name}
          </LargeText>

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image source={route.params.event.hasHostImage ? { uri: route.params.event.hostImage}
              : require("../../../assets/logo.png")} style={styles.profileImg}/>
            <MediumText size={18}>{route.params.event.hostID === user.uid ? "You ;)"
              : (route.params.event.hostFirstName ?
                route.params.event.hostFirstName + " " + route.params.event.hostLastName
              : route.params.event.hostName)}
            </MediumText>
          </View>

          {event.tags && <TagsList marginVertical={20} tags={event.tags} left/>}

          {/* 3 event details (location, date, time} are below */}

          <View style={styles.logistics}>
            <TouchableOpacity style={styles.row} onPress={() => {
              openMap({ query: event.location, provider: "google" });
            }}>
              <Ionicons name="location-sharp" size={20} />
              <NormalText paddingHorizontal={10} color="black">
                {event.location}
              </NormalText>
            </TouchableOpacity>

            <View style={styles.row}>
              <Ionicons name="calendar-outline" size={20} />
              <NormalText paddingHorizontal={10} color="black">
                {getDate(event.date.toDate())}
              </NormalText>
            </View>

            <View style={styles.row}>
              <Ionicons name="time-outline" size={20} />
              <NormalText paddingHorizontal={10} color="black">
                {getTime(event.date.toDate())}
              </NormalText>
            </View>
          </View>

          <NormalText marginBottom={20} color="black">
            {event.additionalInfo}
          </NormalText>

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
            {openIcebreakers && event.ice &&
              event.ice.map((ice, index) => (
                <Icebreaker number={index + 1} icebreaker={ice} key={index} />
              ))}
          </View>

          {/* Attendance dropdown */}
          {event.hostID === user.uid && <View>
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
                  people.map((person, index) => {
                    if (person.id !== user.uid) {
                      return (
                        <Attendance
                          size={17}
                          person={person}
                          key={person.id}
                          attending={attendees[index]}
                          onPress={() => markAttendee(index)}
                        />
                      );
                    }
                  })
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

  option: {
    padding: 10
  },

  row: {
    flexDirection: "row",
    marginVertical: 4,
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

  icebreakers: {
    textAlign: "left",
    marginBottom: 20,
    paddingHorizontal: 25,
  },

  logistics: {
    marginVertical: 15,
  },
});

export default WhileYouEat;
