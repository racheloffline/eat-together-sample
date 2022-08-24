//View invites to private events

import React, { useEffect, useState } from "react";
import { FlatList, View, StyleSheet } from "react-native";
import { Layout, TopNav } from "react-native-rapi-ui";
import NormalText from "../../components/NormalText";
import { Ionicons } from "@expo/vector-icons";
import MediumText from "../../components/MediumText";
import { db } from "../../provider/Firebase";
import firebase from "firebase";
import EventCard from "../../components/EventCard";

export default function ({ navigation }) {
  //Get a list of current invites from Firebase up here
  const user = firebase.auth().currentUser;
  const [invites, setInvites] = useState([]); // initial state, function used for updating initial state

  //Check to see if we should display the "No Invites" placeholder text
  function shouldDisplayPlaceholder(list) {
    if (list == null || list.length === 0) {
      return "No invites as of yet. Explore some public events! :)";
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
            docID: doc.id,
            name: data.name,
            image: data.image,
            hasImage: data.hasImage,
            location: data.location,
            date: data.date,
            details: data.description,
            hostID: data.hostID,
            hostName: data.hostName,
            hostImage: data.hostImage,
            accepted: data.accepted,
            inviteID: data.inviteID,
            id: data.inviteID,
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
      <TopNav
        middleContent={<MediumText center>Invites</MediumText>}
        leftContent={<Ionicons name="chevron-back" size={20} />}
        leftAction={() => navigation.goBack()}
      />
      <View style={{ padding: 20 }}>
        <View style={styles.noInvitesView}>
          <NormalText center={"center"}>
            {shouldDisplayPlaceholder(invites)}
          </NormalText>
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
                  id: item.docID,
                  name: item.name,
                  image: item.image,
                  hasImage: item.hasImage,
                  location: item.location,
                  date: item.date.toDate().toDateString(),
                  time: item.date.toDate().toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                  details: item.description,
                  hostID: item.hostID,
                  hostName: item.hostName,
                  hostImage: item.hostImage,
                  accepted: item.accepted,
                  inviteID: item.inviteID,
                };
                navigation.navigate("NotificationFull", {
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
  header: {
    padding: 40,
    display: "flex",
    marginBottom: -20,
  },
  headingText: {
    fontSize: 50,
  },
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
