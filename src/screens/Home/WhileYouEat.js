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
  Image,
} from "react-native";
import { Layout, TopNav } from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";

import Attendance from "../../components/Attendance";
import Icebreaker from "../../components/Icebreaker";
import TagsList from "../../components/TagsList";
import CircularButton from "../../components/CircularButton";

import LargeText from "../../components/LargeText";
import MediumText from "../../components/MediumText";
import NormalText from "../../components/NormalText";
import Link from "../../components/Link";
import Toggle from "../../components/Toggle";

import getDate from "../../getDate";
import getTime from "../../getTime";
import { db, auth } from "../../provider/Firebase";
import * as firebase from "firebase/compat";
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from "react-native-popup-menu";
import openMap from "react-native-open-maps";

import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import {
  GOOGLE_AUTH_CLIENT_ID,
  GOOGLE_AUTH_CLIENT_ID_ANDROID,
  GOOGLE_AUTH_CLIENT_ID_IOS
} from "@env"; //Environment variables

WebBrowser.maybeCompleteAuthSession();

const WhileYouEat = ({ route, navigation }) => {
  // Event details
  const [event, setEvent] = useState(route.params.event);
  const [friend, setFriend] = useState(null); // Display a friend who is also attending the event
  const [host, setHost] = useState(null); // Get the host of the event

  // Data for the attendees
  const [attendees, setAttendees] = useState([]);
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(false);

  // For tracking opening and closing
  const [openAttendance, setOpenAttendance] = useState(false);
  const [openIcebreakers, setOpenIcebreakers] = useState(false);

  // Get the current user
  const user = auth.currentUser;
  const [groupChat, setGroupChat] = useState(null); // Info for the group chat

  const [accessToken, setAccessToken] = useState(null);
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: GOOGLE_AUTH_CLIENT_ID,
    iosClientId: GOOGLE_AUTH_CLIENT_ID_IOS,
    androidClientId: GOOGLE_AUTH_CLIENT_ID_ANDROID,
    scopes: ["https://www.googleapis.com/auth/calendar"]
  });

  useEffect(() => {
    if (route.params.event.hostID === user.uid) {
      getAttendees();
    }

    db.collection("Users")
      .doc(route.params.event.hostID)
      .get()
      .then((doc) => {
        setHost(doc.data());
      });

    db.collection("Users")
      .doc(user.uid)
      .get()
      .then((doc) => {
        if (friendAttending(doc.data())) {
          db.collection("Users")
            .doc(friendAttending(doc.data()))
            .get()
            .then((doc) => {
              setFriend(doc.data());
            });
        }
      });
    
    if (route.params.event.chatID) {
      db.collection("Groups")
        .doc(route.params.event.chatID)
        .get()
        .then((doc) => {
          const group = {
            groupID: route.params.event.chatID,
            uids: doc.data().uids,
            name: doc.data().name,
            messages: doc.data().messages,
          };

          setGroupChat(group);
        });
    }
  }, []);

    const publishEventsToGoogleCalendar = async (calendarId) => {
      if (generatedSchedule.length > 0) {
        console.log(generatedSchedule)
        const google_event_objects = generatedSchedule.map((activity) => {
          return {
            start: { dateTime: moment(activity.start_time, "YYYY-M-D H:mm:s").toDate() },
            end: { dateTime: moment(activity.end_time, "YYYY-M-D H:mm:s").toDate() },
            endTimeUnspecified: !activity.end_time,
            summary: activity.name,
            location: Array.isArray(activity.location) ? `${activity.location[0] || activity.location[1]} - ${activity.location[activity.location.length -1] || activity.location[activity.location.length -2]}` : activity.location,
          };
        });

        for (let i = 0; i < Math.ceil(google_event_objects.length / 3); i++) {
          console.log("helloo...", google_event_objects.slice(i * 3,(i+1)*3))
          await Promise.all(
              google_event_objects.slice(i * 3,(i+1)*3).map((event) =>
                insertEventToGoogleCalendar(calendarId, event)
              )
            );
            await new Promise(r => setTimeout(r, 1000));
        }
      }
    };


  useEffect(() => {
    async function fetchData() {
      if (response?.type === 'success') {
        setLoading(true);
        const accessToken = response.authentication.accessToken;
        const email = await fetchEmail(accessToken);

        const startTime = new Date(route.params.event.startDate * 1000);
        const endTime = new Date(route.params.event.endDate * 1000);
        const eventName = route.params.event.name;
        const info = route.params.event.additionalInfo;

        console.log(startTime.toString());
        console.log(route.params.event.startDate*1000);
        console.log(endTime.toString());
        console.log(eventName);
        console.log(info);

        const oauth2Client = new Google.auth.OAuth2('clientID', 'clientSecret');
          oauth2Client.setCredentials({
            access_token: 'google access token',
            refresh_token: 'google refresh token',
            expiry_date: 'token expiry date',
          });

        const calendar = google.calendar({ version: "v3", oauth2Client });

        const event = {
           summary: eventName,
           description: info,
           start: {
             dateTime: '2022-12-28T01:00:00-07:00',
             timeZone: 'Asia/kolkata',
           },
           end: {
             dateTime: '2022-12-28T05:00:00-07:00',
             timeZone: 'Asia/Kolkata',
           },
         };

         request = gapi.client.calendar.events.insert({
           'calendarId': 'primary',
           'resource': event
         })
//        calendar.events.insert({
//            calendarId: "primary",
//            resource: event,
//        })
        .then((event) =>  console.log('Event created: %s', event.htmlLink))
        .catch((error) => console.log('Some error occured', error));
      }
    }

    fetchData();
  }, [response]);

    // Get the user's email
    const fetchEmail = async (accessToken) => {
      const response = await fetch(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${accessToken}`,
        {
          method: "GET",
          headers: new Headers({
            Authorization: `Bearer ${accessToken}`,
          }),
        }).then(function (res) {
          return res.json();
        });

      return response.email;
    }

  // Function to navigate to the chat for this event
  const goToEventChat = () => {
    if (route.params.event.chatID) {
      navigation.navigate("ChatRoom", {
        group: groupChat
      });
    } else {
      alert("This feature is still in development and will be applied to your future events!")
    }
  };

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

            setPeople((people) => [...people, data]);
            setAttendees((attendees) => [...attendees, attended]);
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
  const editEvent = (newEvent) => {
    setEvent((event) => ({
      ...event,
      ...newEvent,
    }));
  };

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
  };

  // Determine if a friend is attending the event or not, and return them
  const friendAttending = (userInfo) => {
    let friend = null;
    userInfo.friendIDs.forEach((f) => {
      if (
        route.params.event.attendees.includes(f) &&
        f !== route.params.event.hostID
      ) {
        friend = f;
        return;
      }
    });

    return friend;
  };

  return (
    <Layout>
      <TopNav
        middleContent={<MediumText center>{event.name}</MediumText>}
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
                {event.hostID !== user.uid && (
                  <MenuOption
                    onSelect={() => reportEvent()}
                    style={styles.option}
                  >
                    <NormalText size={18}>Report Event</NormalText>
                  </MenuOption>
                )}
                {event.hostID === user.uid && (
                  <MenuOption
                    onSelect={() =>
                      navigation.navigate("EditEvent", {
                        event,
                        editEvent,
                        editEvent2: route.params.editEvent,
                      })
                    }
                    style={styles.option}
                  >
                    <NormalText size={18}>Edit Event</NormalText>
                  </MenuOption>
                )}
                <MenuOption
                  onSelect={() => withdrawAlert()}
                  style={styles.option}
                >
                  <NormalText size={18} color="red">
                    Withdraw
                  </NormalText>
                </MenuOption>
              </MenuOptions>
            </Menu>
          </View>
        }
      />

      {/* In-event chat button */}
      <View style={styles.eventChat}>
        <CircularButton onPress={() => goToEventChat()}>
          <Ionicons name="chatbox-ellipses-outline" size={30} />
        </CircularButton>
      </View>
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
        <CircularButton width={110} marginHorizontal={20} marginVertical={10}
            onPress={() => {
                promptAsync();
            }}
            >
            <MediumText size={26} color ={"white"}>
                {"+ Add"}
            </MediumText>
        </CircularButton>
        <View style={styles.infoContainer}>
          <LargeText size={24} marginBottom={10}>
            {event.name}
          </LargeText>
          <TouchableOpacity
            style={styles.row}
            onPress={() => {
              if (host && route.params.event.hostID !== user.uid)
                navigation.navigate("FullProfile", {
                  person: host,
                });
            }}
            disabled={route.params.event.hostID === user.uid}
          >
            <Image
              source={
                route.params.event.hasHostImage
                  ? { uri: route.params.event.hostImage }
                  : require("../../../assets/logo.png")
              }
              style={styles.profileImg}
            />
            <MediumText size={18}>
              {route.params.event.hostID === user.uid
                ? "You!"
                : route.params.event.hostFirstName
                ? route.params.event.hostFirstName +
                  " " +
                  route.params.event.hostLastName
                : route.params.event.hostName}
            </MediumText>
          </TouchableOpacity>

          <View style={styles.row}>
            <NormalText>
              {route.params.event.attendees.length} attendee
              {route.params.event.attendees.length !== 1 && "s"}
            </NormalText>
            {friend && <NormalText>, including: </NormalText>}
            {friend && (
              <Image
                source={
                  friend.hasImage
                    ? { uri: friend.image }
                    : require("../../../assets/logo.png")
                }
                style={styles.profileImg}
              />
            )}
            {friend && (
              <NormalText>
                {friend.firstName + " " + friend.lastName}
              </NormalText>
            )}
          </View>
          {event.tags && event.tags.length > 0 && (
            <TagsList marginVertical={10} tags={event.tags} left />
          )}

          {/* 3 event details (location, date, time} are below */}

          <View style={styles.logistics}>
            <View style={styles.row}>
              <Ionicons name="location-sharp" size={20} />
              <NormalText paddingHorizontal={10} color="black">
                {event.location}
              </NormalText>
              <Link
                onPress={() =>
                  openMap({ query: event.location, provider: "google" })
                }
              >
                (view on map)
              </Link>
            </View>

            <View style={styles.row}>
              <Ionicons name="calendar-outline" size={20} />
              <NormalText paddingHorizontal={10} color="black">
                {event.startDate ? getDate(event.startDate.toDate()) : getDate(event.date.toDate())}
              </NormalText>
            </View>

            <View style={styles.row}>
              <Ionicons name="time-outline" size={20} />
              <NormalText paddingHorizontal={10} color="black">
                {event.startDate ? getTime(event.startDate.toDate()) : getTime(event.date.toDate())}
                {event.endDate && " - ".concat(getTime(event.endDate.toDate()))}
              </NormalText>
            </View>
          </View>

          <NormalText marginBottom={20} color="black">
            {event.additionalInfo}
          </NormalText>

          {/* Icebreakers dropdown */}
          <Toggle 
            open={openIcebreakers}
            onPress={() => setOpenIcebreakers(!openIcebreakers)}
            title="Icebreakers"
          />

          <View style={styles.icebreakers}>
            {openIcebreakers &&
              event.ice &&
              event.ice.map((ice, index) => (
                <Icebreaker number={index + 1} icebreaker={ice} key={index} />
              ))}
          </View>

          {/* Attendance dropdown */}
          
          {(event.hostID === user.uid || event.type === "recommendation") && (
            <View>
              <Toggle 
                open={openAttendance}
                onPress={() => setOpenAttendance(!openAttendance)}
                title="Attendance"
              />

              {openAttendance && (
                <View style={{ marginTop: 10 }}>
                  {people.length === 0 ? (
                    <NormalText paddingHorizontal={25} size={17} color="black">
                      {"Just yourself"}
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
            </View>
          )}
        </View>
      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  infoContainer: {
    marginHorizontal: 30,
    marginBottom: 50,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
    flexWrap: "wrap",
  },

  profileImg: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderColor: "#5DB075",
    borderWidth: 1,
    backgroundColor: "white",
    marginRight: 3,
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
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

  eventChat: {
    position: "absolute",
    bottom: 30,
    right: 30,
    zIndex: 1,
  }
});

export default WhileYouEat;
