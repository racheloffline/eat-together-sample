//Display upcoming events to join

import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, Dimensions, ActivityIndicator } from "react-native";

import { db, auth, storage } from "../../provider/Firebase";
import { TopNav, Layout } from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";
import firebase from "firebase";

import Button from "../../components/Button";
import MediumText from "../../components/MediumText";
import InvitePerson from "../../components/InvitePerson";
import Searchbar from "../../components/Searchbar";
import HorizontalRow from "../../components/HorizontalRow";
import Filter from "../../components/Filter";

import { generateColor } from "../../methods";

// Stores image in Firebase Storage
const storeImage = async (uri, event_id) => {
  const response = await fetch(uri);
  const blob = await response.blob();

  let ref = storage.ref().child("eventPictures/" + event_id);
  return ref.put(blob);
};

// Fetches image from Firebase Storage
const fetchImage = async (id) => {
  let ref = storage.ref().child("eventPictures/" + id);
  return ref.getDownloadURL();
};

async function sendInvites(
  attendees,
  invite,
  navigation,
  user,
  id,
  image,
  icebreakers
) {
  //Send invites to each of the selected users
  async function sendInvitations(ref) {
    ref
      .collection("Invites")
      .add({
        date: invite.date,
        description: invite.additionalInfo,
        hostID: user.id,
        hostFirstName: user.firstName,
        hostLastName: user.lastName,
        hasImage: invite.hasImage,
        image: invite.image,
        hasHostImage: user.hasImage,
        hostImage: user.image,
        location: invite.location,
        name: invite.name,
        inviteID: id,
      })
      .then((r) => {
        invite.clearAll();
        navigation.navigate("OrganizePrivate");
      });
  }

  await db
    .collection("Private Events")
    .doc(id)
    .set({
      id,
      name: invite.name,
      hostID: user.id,
      hostFirstName: user.firstName,
      hostLastName: user.lastName,
      hasHostImage: user.hasImage,
      hostImage: user.image,
      location: invite.location,
      date: invite.date,
      additionalInfo: invite.additionalInfo,
      ice: icebreakers,
      attendees: [user.id], //ONLY start by putting the current user as an attendee
      hasImage: invite.hasImage,
      image,
    })
    .then(async (docRef) => {
      await attendees.forEach((attendee) => {
        const ref = db.collection("User Invites").doc(attendee);
        ref.get().then(async (docRef) => {
          if (attendee !== user.id) {
            await sendInvitations(ref);
          }
        });
      });

      const storeID = {
        type: "private",
        id,
      };

      await db
        .collection("Users")
        .doc(user.id)
        .update({
          hostedEventIDs: firebase.firestore.FieldValue.arrayUnion(storeID),
          attendingEventIDs: firebase.firestore.FieldValue.arrayUnion(storeID),
          attendedEventIDs: firebase.firestore.FieldValue.arrayUnion(storeID),
        });

      alert("Invitations sent!");
    });
}

// Determines if a person matches the search query or not
const isMatch = (person, text) => {
  // Name
  const fullName = person.firstName + " " + person.lastName;
  if (fullName.toLowerCase().includes(text.toLowerCase())) {
    return true;
  }

  // Username
  if (person.username.toLowerCase().includes(text.toLowerCase())) {
    return true;
  }

  // Tags
  return person.tags.some((tag) =>
    tag.tag.toLowerCase().includes(text.toLowerCase())
  );
};

export default function ({ route, navigation }) {
  // Current user
  const user = auth.currentUser;
  const [userInfo, setUserInfo] = useState([]);

  const attendees = route.params.attendees;

  // Other users
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  // Disable button or not
  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const [icebreakers, setIcebreakers] = useState([]); // Icebreakers

  // Filters
  const [curSearch, setCurSearch] = useState("");
  const [similarInterests, setSimilarInterests] = useState(false);
  const [mutualFriends, setMutualFriends] = useState(false);

  const [mutuals, setMutuals] = useState([]); // Mutual friends
  const [loadingScreen, setLoadingScreen] = useState(true); // Loading screen for filter calculations

  useEffect(async () => {
    async function fetchData() {
      //      picks icebreaker set from set of icebreakers randomly
      const breakOptions = [];
      await db.collection("Icebreakers").onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          breakOptions.push(doc.id);
        });
        var num = Math.floor(Math.random() * breakOptions.length);
        db.collection("Icebreakers")
          .doc(breakOptions[num])
          .get()
          .then((doc) => {
            setIcebreakers(doc.data().icebreakers);
          });
      });

      // Fetch all users
      const ref = db.collection("Users");
      await ref.onSnapshot((query) => {
        const list = [];
        query.forEach((doc) => {
          let data = doc.data();
          if (data.verified && data.id !== user.uid) {
            list.push(data);
          } else if (data.id === user.uid) {
            setUserInfo(data);

            data.friendIDs.forEach((id) => {
              db.collection("Users")
                .doc(id)
                .get()
                .then((doc) => {
                  if (doc) {
                    if (doc.data().friendIDs) {
                      // TODO FIX: Not all docs have friendIDs in db
                      setMutuals((mutuals) =>
                        mutuals.concat(doc.data().friendIDs)
                      );
                    }
                  }
                });
            });
          }
        });
        setFilteredUsers(list);
        setUsers(list);
      });
    }

    fetchData().then(() => setLoadingScreen(false));
  }, []);

  // For searching
  const onChangeText = (text) => {
    setCurSearch(text);
    search(text);
  };

  const search = (text) => {
    let newEvents = users.filter((e) => isMatch(e, text));
    setFilteredUsers(newEvents);
    setSimilarInterests(false);
    setMutualFriends(false);
  };

  // Display people in descending order of similar tags
  const sortBySimilarInterests = () => {
    setLoadingScreen(true);

    if (!similarInterests) {
      let copy = [...users];

      fetch("https://eat-together-match.uw.r.appspot.com/find_similarity", {
        method: "POST",
        body: JSON.stringify({
          currTags: userInfo.tags.map((t) => t.tag),
          otherTags: getPeopleTags(),
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          let i = 0;
          copy.forEach((p) => {
            p.similarity = res[i];
            i++;
          });

          copy = copy.sort((a, b) => b.similarity - a.similarity);
          setFilteredUsers(copy);
          setLoadingScreen(false);
        })
        .catch((e) => {
          // If error, alert the user
          alert("An error occured, try again later :(");
          setLoadingScreen(false);
        });
    } else {
      setLoadingScreen(false);
      setFilteredUsers(users);
    }

    setSimilarInterests(!similarInterests);
    setMutualFriends(false);
    setCurSearch("");
  };

  // Get a list of everyone's tags
  const getPeopleTags = () => {
    let tags = [];
    users.forEach((p) => {
      tags.push(p.tags.map((t) => t.tag));
    });

    return tags;
  };

  // Display people who are mutual friends
  const filterByMutualFriends = () => {
    setLoadingScreen(true);

    if (!mutualFriends) {
      const newUsers = users.filter((p) => mutuals.includes(p.id));
      setFilteredUsers(newUsers);
    } else {
      setFilteredUsers(users);
    }

    setLoadingScreen(false);
    setMutualFriends(!mutualFriends);
    setSimilarInterests(false);
    setCurSearch("");
  };

  return (
    <Layout style={{ flex: 1 }}>
      <TopNav
        middleContent={<MediumText center>Suggested People</MediumText>}
        leftContent={<Ionicons name="chevron-back" size={20} />}
        leftAction={() => navigation.goBack()}
      />

      <View style={{ padding: 20 }}>
        <Searchbar
          placeholder="Search by name, username, or tags"
          value={curSearch}
          onChangeText={onChangeText}
        />

        <HorizontalRow>
          <Filter
            checked={similarInterests}
            onPress={sortBySimilarInterests}
            text="Sort by similar interests"
          />
          <Filter
            checked={mutualFriends}
            onPress={filterByMutualFriends}
            text="Mutual friends"
          />
        </HorizontalRow>
      </View>

      {!loadingScreen ? <FlatList
        contentContainerStyle={styles.invites}
        keyExtractor={(item) => item.id}
        data={filteredUsers}
        renderItem={({ item }) => (
          <InvitePerson
            navigation={navigation}
            person={item}
            attendees={attendees}
            color={generateColor()}
            disable={() => setDisabled(true)}
            undisable={() => setDisabled(false)}
          />
        )}
      /> : <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size={100} color="#5DB075" />
      </View>}

      <Button
        disabled={disabled || loading}
        onPress={() => {
          setLoading(true);
          const id = Date.now() + user.uid; // Generate a unique ID for the event

          if (route.params.hasImage) {
            storeImage(route.params.image, id).then(() => {
              fetchImage(id).then((uri) => {
                sendInvites(
                  attendees,
                  route.params,
                  navigation,
                  userInfo,
                  id,
                  uri,
                  icebreakers
                ).then(() => {
                  setLoading(false);
                });
              });
            });
          } else {
            sendInvites(
              attendees,
              route.params,
              navigation,
              userInfo,
              id,
              "",
              icebreakers
            ).then(() => {
              setLoading(false);
            });
          }
        }}
      >{loading ? "Sending ..." : "Send Invites"}</Button>
    </Layout>
  );
}

const styles = StyleSheet.create({
  invites: {
    alignItems: "center",
  },
  submit: {
    position: "absolute",
    bottom: 0,
  },
  tagInput: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
  },

  input: {
    width: Dimensions.get("screen").width / 1.5,
    marginRight: 10,
  },
});
