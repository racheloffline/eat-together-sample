//View invites to private events

import React, { useEffect, useState } from "react";
import { FlatList, View, StyleSheet } from "react-native";
import { Layout, TopNav } from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";

import Header from "../../components/Header";
import HorizontalSwitch from "../../components/HorizontalSwitch";
import MediumText from "../../components/MediumText";
import EventCard from "../../components/EventCard";

import { db } from "../../provider/Firebase";
import firebase from "firebase/compat";

export default function (props) {
  //Get a list of current invites from Firebase up here
  const user = firebase.auth().currentUser;
  const [invites, setInvites] = useState([]); // initial state, function used for updating initial state

  //Check to see if we should display the "No Invites" placeholder text
  function shouldDisplayPlaceholder(list) {
    if (list == null || list.length === 0) {
      return "No invites as of yet. Explore some public events!";
    } else {
      return "";
    }
  }

  useEffect(() => {
    async function fetchData() {
      await db.collection("Users").doc(user.uid).update({
        hasNotif: false,
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
          return a.date.seconds - b.date.seconds;
        });
        setInvites(list);
      });
    }
    fetchData();
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
      />}

      <View style={{ paddingTop: 30 }}>
        <View style={styles.noInvitesView}>
          <MediumText center={"center"}>
            {shouldDisplayPlaceholder(invites)}
          </MediumText>
        </View>
        <FlatList
          contentContainerStyle={styles.cards}
          keyExtractor={(item) => item.id}
          data={invites}
          renderItem={({ item }) => (
            <EventCard
              event={item}
              click={() => {
                let inviteToSend = {
                  ...item,
                  id: item.docID,
                };
                props.navigation.navigate("NotificationFull", {
                  invite: inviteToSend,
                  hasPassed:
                    item.date.toDate().getTime() < new Date().getTime(),
                });
              }}
            />
          )}
        />
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  noInvitesView: {
    marginVertical: -20,
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
