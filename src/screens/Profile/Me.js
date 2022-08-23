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

        <View style={styles.connections}>
          <Ionicons
          name = "list-circle"
          size={35}
          color="gray"
              onPress={() => {
                navigation.navigate("Connections", {
                  user: userInfo,
                  image: userInfo.image,
                  updateInfo,
                });
              }}>
          </Ionicons>
        </View>

        <View style={styles.name}>
          <LargeText>{userInfo.firstName + " " + userInfo.lastName}</LargeText>
          <NormalText>
            {mealsAttended + "/" + mealsSignedUp + " meals attended"}
          </NormalText>
          <MediumText>@{userInfo.username}</MediumText>

          <TouchableOpacity
            style={styles.edit}
            onPress={function () {
              navigation.navigate("Edit", {
                user: userInfo,
                updateInfo,
              });
            }}
            marginVertical={10}
          >
            <Feather name="edit-2" size={30}/>
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
    width: "100%",
    marginVertical: 20,
    alignItems: "center",
  },

  settings: {
    position: "absolute",
    right: 20,
    top: 20,
  },

  edit: {
    position: "absolute",
    right: "10%",
    top: 0,
  },

  connections: {
    position: "absolute", 
    right: 130,
    top: 172
  }
});
