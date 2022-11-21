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
      await db.collection("Users").doc(user.uid).update({
        hasNotif: false,
      });

      await db.collection("Users").doc(user.uid).onSnapshot(doc => {
        setUnread(doc.data().hasUnreadMessages)
      });

      let ref = db
        .collection("User Invites")
        .doc(user.uid)
        .collection("Invites");
      ref.onSnapshot((query) => {
        let list = [];
        query.forEach((doc) => {
          let data = doc.data();
          list.push({
            ...data,
            docID: doc.id,
          });
        });
        list = list.sort((a, b) => {
          return compareDates(a, b);
        });
        setNotifications(list);
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
              onPress={() => {
                let inviteToSend = {
                  ...item,
                  id: item.docID,
                };
                props.navigation.navigate("NotificationFull", {
                  invite: inviteToSend,
                  hasPassed:
                    (item.endDate ? item.endDate.toDate().getTime()
                    : item.date.toDate().getTime()) < new Date().getTime(),
                });
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
