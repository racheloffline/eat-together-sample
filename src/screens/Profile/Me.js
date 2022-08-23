import React, { useEffect, useState } from "react";
import { View, StyleSheet, Image, Dimensions, FlatList } from "react-native";
import { Layout } from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";
import { db, auth, storage } from "../../provider/Firebase";

import LargeText from "../../components/LargeText";
import MediumText from "../../components/MediumText";
import NormalText from "../../components/NormalText";
import TagsList from "../../components/TagsList";
import EventCard from "../../components/EventCard";
import Button from "../../components/Button";

export default function ({ navigation }) {
  const user = auth.currentUser;

  const [userInfo, setUserInfo] = useState({});
  const [mealsAttended, setMealsAttended] = useState(0);
  const [mealsSignedUp, setMealsSignedUp] = useState(0);

  const [events, setEvents] = useState([]);

  useEffect(() => {
    async function fetchData() {
      await db
        .collection("Users")
        .doc(user.uid)
        .onSnapshot(async (doc) => {
          setUserInfo(doc.data());
          setMealsAttended(doc.data().attendedEventIDs.length);
          setMealsSignedUp(
            doc.data().attendingEventIDs.length +
              doc.data().archivedEventIDs.length
          );

          let newEvents = [];
          doc.data().archivedEventIDs.forEach((e) => {
            if (e.type === "public") {
              db.collection("Public Events")
                .doc(e.id)
                .get()
                .then((event) => {
                  let data = event.data();
                  data.type = e.type;
                  newEvents.unshift(data);
                  setEvents(newEvents);
                });
            } else {
              db.collection("Private Events")
                .doc(e.id)
                .get()
                .then((event) => {
                  let data = event.data();
                  data.type = e.type;
                  newEvents.unshift(data);
                  setEvents(newEvents);
                });
            }
          });
        });
    }

    fetchData();
  }, []);

  const updateInfo = (newFirstName, newLastName, newBio, newTags, newImage) => {
    setUserInfo((prev) => ({
      ...prev,
      firstName: newFirstName,
      lastName: newLastName,
      bio: newBio,
      tags: newTags,
      image: newImage
    }));
  };

  return (
    <Layout>
      <View style={styles.page}>
        <View style={styles.background} />
        <View style={styles.settings}>
          <Ionicons
            name="settings-sharp"
            size={40}
            color="white"
            onPress={() => {
              navigation.navigate("Settings", {
                user: userInfo,
                image: userInfo.image,
                updateInfo,
              });
            }}
          ></Ionicons>
        </View>

        <Image
          style={styles.image}
          source={
            userInfo.hasImage
              ? { uri: userInfo.image }
              : require("../../../assets/logo.png")
          }
        />
        <View style={styles.name}>
          <LargeText>{userInfo.firstName + " " + userInfo.lastName}</LargeText>
          <NormalText>
            {mealsAttended + "/" + mealsSignedUp + " meals attended"}
          </NormalText>
          <MediumText>@{userInfo.username}</MediumText>
        </View>
        <TagsList tags={userInfo.tags ? userInfo.tags : []} />
        <View style={styles.edit}>
          <Button
            onPress={function () {
              navigation.navigate("Edit", {
                user: userInfo,
                updateInfo,
              });
            }}
            marginVertical={10}
          >
            Edit Profile
          </Button>
        </View>
        <MediumText center>{userInfo.bio}</MediumText>
      </View>
      <FlatList
        contentContainerStyle={styles.cards}
        keyExtractor={(item) => item.id}
        data={events}
        renderItem={({ item }) => <EventCard event={item} disabled />}
      />
    </Layout>
  );
}
const styles = StyleSheet.create({
  cards: {
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 40,
  },

  page: {
    paddingTop: 30,
    alignItems: "center",
    paddingHorizontal: 10,
  },

  background: {
    position: "absolute",
    width: Dimensions.get("screen").width,
    height: 150,
    backgroundColor: "#5DB075",
  },

  image: {
    width: 175,
    height: 175,
    borderColor: "white",
    borderWidth: 3,
    borderRadius: 100,
    backgroundColor: "white",
  },

  name: {
    marginVertical: 20,
    alignItems: "center",
  },

  settings: {
    position: "absolute",
    right: 20,
    top: 20,
  },

  edit: {
    marginVertical: 20,
    alignItems: "center",
  },
});
