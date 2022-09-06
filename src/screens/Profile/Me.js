import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  Dimensions,
  ScrollView,
  TouchableOpacity
} from "react-native";
import { Layout } from "react-native-rapi-ui";
import { Ionicons, Feather } from "@expo/vector-icons";
import { db, auth } from "../../provider/Firebase";

import LargeText from "../../components/LargeText";
import MediumText from "../../components/MediumText";
import NormalText from "../../components/NormalText";
import TagsList from "../../components/TagsList";
import EventCard from "../../components/EventCard";

const { width, height } = Dimensions.get('window');

//Guideline sizes are based on standard ~5" screen mobile device
const guidelineBaseWidth = 350;
const guidelineBaseHeight = 680;

const scale = size => width / guidelineBaseWidth * size;
const verticalScale = size => height / guidelineBaseHeight * size;
const moderateScale = (size, factor = 0.5) => size + ( scale(size) - size ) * factor;

export {scale, verticalScale, moderateScale};

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
          let eventsLength = doc.data().archivedEventIDs.length;

          doc.data().archivedEventIDs.forEach(async (e) => {
            let table = "Public Events";
            if (e.type === "private") {
              table = "Private Events";
            }

            await db.collection(table)
                .doc(e.id)
                .get()
                .then((event) => {
                  let data = event.data();
                  newEvents.push(data);
                  eventsLength--;

                  if (eventsLength === 0) {
                    // Sort events by date
                    newEvents = newEvents.sort((a, b) => {
                      return a.date.seconds - b.date.seconds;
                    });

                    setEvents(newEvents);
                  }
                }).catch(e => {
                  alert("There was an error fetching some of your meals :( try again later");

                  eventsLength--;
                  newEvents = newEvents.sort((a, b) => {
                    return a.date.seconds - b.date.seconds;
                  });

                  setEvents(newEvents);
                });
          });
        });
    }

    fetchData();
  }, []);

  const updateInfo = (newFirstName, newLastName, newPronouns, newBio, newTags, newImage) => {
    setUserInfo((prev) => ({
      ...prev,
      firstName: newFirstName,
      lastName: newLastName,
      pronouns: newPronouns,
      bio: newBio,
      tags: newTags,
      image: newImage
    }));
  };

  return (
    <Layout>
      <ScrollView contentContainerStyle={styles.page}>
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
          <NormalText marginBottom={5}>({userInfo.pronouns})</NormalText>
          <NormalText>
            {mealsAttended + "/" + mealsSignedUp + " meals attended"}
          </NormalText>
          <MediumText>@{userInfo.username}</MediumText>

          <TouchableOpacity
            style={styles.connections}
            onPress={() => {
              navigation.navigate("Connections", {
                user: userInfo,
                image: userInfo.image,
                updateInfo,
              });
            }}
            marginVertical={10}
          >
            <Ionicons name="list-circle" size={20} color="#4C6FB1"/>
            <NormalText color="#4C6FB1"> Connections</NormalText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.edit}
            onPress={() => {
              navigation.navigate("Edit", {
                user: userInfo,
                updateInfo,
              });
            }}
            marginVertical={10}
          >
            <Feather name="edit-2" size={20} color="#4C6FB1"/>
            <NormalText color="#4C6FB1"> Edit Profile</NormalText>
          </TouchableOpacity>
        </View>

        <TagsList tags={userInfo.tags ? userInfo.tags : []} />
        <MediumText center>{userInfo.bio}</MediumText>

        <View style={styles.cards}>
          {events && events.map((event) => <EventCard event={event} key={event.id} click={() => {
            navigation.navigate("FullCard", {
              event
            });
          }}/>)}
        </View>
      </ScrollView>
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
    height: verticalScale(150),
    backgroundColor: "#5DB075",
  },

  image: {
    width: moderateScale(175),
    height: verticalScale(175),
    borderColor: "white",
    borderWidth: 3,
    borderRadius: 100,
    backgroundColor: "white",
  },

  name: {
    width: "100%",
    marginVertical: 20,
    alignItems: "center",
  },

  settings: {
    position: "absolute",
    right: 20,
    top: 20,
  },

  connections: {
    position: "absolute",
    left: "2%",
    top: -25,
    flexDirection: "row",
    alignItems: "center",
  },

  edit: {
    position: "absolute",
    right: "2%",
    top: -25,
    flexDirection: "row",
    alignItems: "center",
  },
});
