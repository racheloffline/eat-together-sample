//View invites to private events

import React, { useEffect, useState } from "react";
import { FlatList, View, StyleSheet, ActivityIndicator } from "react-native";
import { Layout, TopNav } from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";

import Header from "../../components/Header";
import HorizontalSwitch from "../../components/HorizontalSwitch";
import MediumText from "../../components/MediumText";
import Notification from "../../components/Notification";

import { db } from "../../provider/Firebase";
import firebase from "firebase/compat";
import moment from "moment";

export default function (props) {
  // Current user stuff
  const user = firebase.auth().currentUser;
  const [userData, setUserData] = useState({}); // User data
  const [unread, setUnread] = useState(false);

  const [notifications, setNotifications] = useState([]); // Notifications
  
  const [recommendation, setRecommendation] = useState({
    name: "Cafe on the Ave",
    suggestedAttendees: ["0chp0zXVEeXywPjMNUu08lC1gIY2", "c01Lzorh3EccO0aQlqa9mZeysf23"],
    startDate: moment(),
    endDate: moment(),
    menu: ["Ice cream", "Boba", "Coffee", "Milkshake"],
  }); // Recommendations

  const [loading, setLoading] = useState(true); // Loading state for the page

  useEffect(() => {
    async function fetchData() {
      // Show that the user has no unreads
      await db.collection("Users").doc(user.uid).update({
        hasNotif: false
      });

      // Get the list of notifications from the backend
      await db.collection("Users").doc(user.uid).onSnapshot((snap) => {
        let data = snap.data();
        setUserData(data);
        let notifications = data.notifications;

        //Loop through every notif and set them to read
        notifications.forEach((notif) => {
          if(notif.readAt == null) {
            notif.readAt = new Date();
          }
        });

        // Replace the old notif array with the new, updated array (with read times)
        db.collection("Users").doc(user.uid).update({
          notifications: notifications
        }).then(() => {
          setNotifications([...notifications.reverse(), {
            id: "aoisdjfij",
            body: "Bruh",
            title: "Bruh",
            type: "recommendation",
          }]);
        });
      });
    }

    fetchData().then(() => {
      setLoading(false);
    });
  }, []);

  return (
    <Layout>
      {props.fromNav ?
        <Header name="Notifications" navigation={props.navigation} connections/> :
        <TopNav
          middleContent={<MediumText center>Notifications</MediumText>}
          leftContent={
            <Ionicons
              name="chevron-back"
              size={20}
            />
          }
          leftAction={() => props.navigation.goBack()}
        />
      }
      {props.fromNav && <HorizontalSwitch
        left="Notifications"
        right="Messages"
        current="left"
        press={() => props.navigation.navigate("ChatMain")}
        pingRight={unread}
      />}
      
      {loading ?
        <View style={styles.noInvitesView}>
          <ActivityIndicator size={100} color="#5DB075" />
          <MediumText>Hang tight ...</MediumText>
        </View>
      : notifications.length > 0 ? 
        <FlatList
          contentContainerStyle={styles.cards}
          keyExtractor={(item) => item.id}
          data={notifications}
          renderItem={({ item }) => (
            <Notification
              notif={item}
              showButton={!(item.type) ? false : true}
              onPress={() => {
                switch (item.type) {
                  case "invite":
                    db.collection("User Invites").doc(user.uid).collection("Invites").doc(item.id).get().then((ss) => {
                      let inviteToSend = {
                        ...ss.data(),
                        id: ss.id,
                      };
                      props.navigation.navigate("NotificationFull", {
                        invite: inviteToSend,
                        notif: item,
                        hasPassed:
                            (ss.data().endDate ? ss.data().endDate.toDate().getTime()
                                : ss.data().date.toDate().getTime()) < new Date().getTime(),
                      });
                    }).catch(() => {
                      alert("There seems to be an error fetching this invite. Please try again later.");
                    });
                    break;
                  case "private event":
                    db.collection("Private Events").doc(item.id).get().then((ss) => {
                      props.navigation.navigate("FullCard", {
                        event: ss.data()
                      });
                    }).catch(() => {
                      alert("There seems to be an error fetching this event. Please try again later.");
                    });
                    break;
                  case "public event":
                    db.collection("Public Events").doc(item.id).get().then((ss) => {
                      props.navigation.navigate("FullCard", {
                        event: ss.data()
                      });
                    }).catch(() => {
                      alert("There seems to be an error fetching this event. Please try again later.");
                    });
                    break;
                  case "user profile":
                    db.collection("Usernames").doc(item.id).get().then((ss) => {
                      db.collection("Users").doc(ss.data().id).get().then((ss2) => {
                        props.navigation.navigate("FullProfile", {
                          person: ss2.data()
                        })
                      })
                    }).catch(() => {
                      alert("This user doesn't seem to exist :(");
                    });
                    break;
                  case "recommendation":
                    props.navigation.navigate("Recommendation", {
                      event: recommendation,
                      userData
                    });
                    break;
                  default:
                    alert("Sorry, an error has occurred.");
                    break;
                }
              }}
            />
          )}
        />
      : 
        <View style={styles.noInvitesView}>
          <MediumText center>No new notifications!</MediumText>
        </View>
      }
    </Layout>
  );
}

const styles = StyleSheet.create({
  noInvitesView: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },

  listView: {
    marginLeft: -15,
  },

  listMainText: {
    padding: 12,
    marginLeft: -12,
    display: "flex",
    textAlign: "left",
    fontSize: 24,
  },

  listSubText: {
    marginLeft: 20,
    display: "flex",
    textAlign: "left",
    fontSize: 18,
  },

  buttons: {
    justifyContent: "center",
    flexDirection: "row",
  },
  
  cards: {
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 40,
  },
});
