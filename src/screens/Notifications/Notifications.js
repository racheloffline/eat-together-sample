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
import { compareDates } from "../../methods";

export default function (props) {
  // Current user stuff
  const user = firebase.auth().currentUser;
  const [unread, setUnread] = useState(false);

  const [notifications, setNotifications] = useState([]); // Notifications
  const [loading, setLoading] = useState(true); // Loading state for the page

  useEffect(() => {
    async function fetchData() {
      // Show that the user has no unreads
      await db.collection("Users").doc(user.uid).update({
        hasNotif: false
      });

      // Get the list of notifications from the backend
      db.collection("Users").doc(user.uid).get().then((snap) => {
        let data = snap.data();
        setNotifications(data.notifications.reverse());
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
        press={(val) => props.navigation.navigate("ChatMain")}
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
                        hasPassed:
                            (ss.data().endDate ? ss.data().endDate.toDate().getTime()
                                : ss.data().date.toDate().getTime()) < new Date().getTime(),
                      });
                    });
                    break;
                  case "private event":
                    db.collection("Private Events").doc(item.id).get().then((ss) => {
                      props.navigation.navigate("FullCard", {
                        event: ss.data()
                      });
                    });
                    break;
                  case "public event":
                    db.collection("Public Events").doc(item.id).get().then((ss) => {
                      props.navigation.navigate("FullCard", {
                        event: ss.data()
                      });
                    });
                    break;
                  case "user profile":
                    db.collection("Usernames").doc(item.id).get().then((ss) => {
                      db.collection("Users").doc(ss.data().id).get().then((ss2) => {
                        props.navigation.navigate("FullProfile", {
                          person: ss2.data()
                        })
                      })
                    })
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
