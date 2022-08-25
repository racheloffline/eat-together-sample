// Display your events

import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, StyleSheet, FlatList } from "react-native";
import { Layout } from "react-native-rapi-ui";

import EventCard from "../../components/EventCard";
import Header from "../../components/Header";
import Searchbar from "../../components/Searchbar";
import HorizontalRow from "../../components/HorizontalRow";
import Filter from "../../components/Filter";

import MediumText from "../../components/MediumText";

import { db, auth } from "../../provider/Firebase";

export default function ({ navigation }) {
  // Get current user
  const user = auth.currentUser;
  const [userInfo, setUserInfo] = useState(null);

  const [events, setEvents] = useState([]); // initial state, function used for updating initial state
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Filters
  const [publicEvents, setPublicEvents] = useState(false);
  const [privateEvents, setPrivateEvents] = useState(false);
  const [fromFriends, setFromFriends] = useState(false);
  const [friendsAttending, setFriendsAttending] = useState(false);

  const [unread, setUnread] = useState(false); // See if we need to display unread notif icon
  const [loading, setLoading] = useState(true); // State variable to show loading screen when fetching data

  useEffect(() => {
    // updates stuff right after React makes changes to the DOM
    async function fetchEvents() {
      await db
        .collection("Users")
        .doc(user.uid)
        .onSnapshot((doc) => {
          let newEvents = [];
          setUserInfo(doc.data());
          setUnread(doc.data().hasNotif);
          let eventsLength = doc.data().attendingEventIDs.length;

          doc.data().attendingEventIDs.forEach((e) => {
            let type = "Private Events";
            if (e.type === "public") {
              type = "Public Events";
            }

            db.collection(type)
              .doc(e.id)
              .get()
              .then((event) => {
                let data = event.data();
                data.type = e.type;
                newEvents.push(data);
                eventsLength--;

                if (eventsLength === 0) {
                  // Sort events by date
                  newEvents = newEvents.sort((a, b) => {
                    return a.date.seconds - b.date.seconds;
                  });

                  setEvents(newEvents);
                  setFilteredEvents(newEvents);
                  setLoading(false);
                }
              }).catch(e => {
                alert("There was an error fetching some of your meals :( try again later");

                eventsLength--;
                newEvents = newEvents.sort((a, b) => {
                  return a.date.seconds - b.date.seconds;
                });

                setEvents(newEvents);
                setFilteredEvents(newEvents);
                setLoading(false);
              });
          });
        });
    }

    fetchEvents().then(() => {
      setLoading(false);
    });
  }, []);

  // For filters
  useEffect(() => {
    let newEvents = [...events];

    if (publicEvents) {
      newEvents = newEvents.filter((e) => e.type === "public");
    }

    if (privateEvents) {
      newEvents = newEvents.filter((e) => e.type === "private");
    }

    if (fromFriends) {
      newEvents = filterByFriendsHosting(newEvents);
    }

    if (friendsAttending) {
      newEvents = filterByFriendsAttending(newEvents);
    }

    setFilteredEvents(newEvents);
  }, [publicEvents, privateEvents, fromFriends, friendsAttending]);

  //Check to see if we should display the "No Events" placeholder text
  function shouldDisplayPlaceholder(list) {
    if (list == null || list.length === 0) {
      return "You are not signed up for any upcoming events.";
    } else {
      return "";
    }
  }

  // Method to filter out events
  const search = (text) => {
    setLoading(true);
    let newEvents = events.filter((e) => isMatch(e, text));
    setFilteredEvents(newEvents);
    setLoading(false);

    // Reset all filters
    setPublicEvents(false);
    setPrivateEvents(false);
  };

  // Determines if an event matches search query or not
  const isMatch = (event, text) => {    
    // Name
    if (event.name.toLowerCase().includes(text.toLowerCase())) {
      return true;
    }

    // Tags
    if (event.tags) {
      if (event.tags.some(tag => tag.toLowerCase().includes(text.toLowerCase()))) {
        return true;
      }
    }
    
    // Host
    if (event.hostName) {
      return event.hostName.toLowerCase().includes(text.toLowerCase());
    }
    
    const fullName = event.hostFirstName + " " + event.hostLastName;
    return fullName.toLowerCase().includes(text.toLowerCase());
  }

  // Method called when a new query is typed in/deleted
  const onChangeText = (text) => {
    setSearchQuery(text);
    search(text);
  };

  // Deletes event from DOM and updates Firestore
  const deleteEvent = (id) => {
    // TODO: Rachel Fix!
    /*
        const user = auth.currentUser;
        db.collection("Private Events").doc(id).update({
            attendees : firebase.firestore.FieldValue.arrayRemove(user.uid)
        }).then(() => {
            db.collection("Private Events").doc(id).get().then((doc) => {
                if (doc.data().attendees.length == 0) {
                }
            });
        });
         */
    const newEvents = events.filter((e) => e.id !== id);
    const newFilteredEvents = events.filter((e) => e.id !== id);
    setEvents(newEvents);
    setFilteredEvents(newFilteredEvents);
  };

  // Display public events only
  const publicOnly = () => {
    setPublicEvents(!publicEvents);
    setPrivateEvents(false);
    setSearchQuery("");
  };

  // Display private events only
  const privateOnly = () => {
    setPrivateEvents(!privateEvents);
    setPublicEvents(false);
    setSearchQuery("");
  };

  // Display events that friends are hosting
  const filterByFriendsHosting = (newEvents) => {
    newEvents = newEvents.filter((e) => userInfo.friendIDs.includes(e.hostID));
    return newEvents;
  };

  // Display events that friends are attending
  const filterByFriendsAttending = (newEvents) => {
    newEvents = newEvents.filter((e) => {
      let included = false;

      e.attendees.forEach((a) => {
        if (userInfo.friendIDs.includes(a)) {
          included = true;
          return;
        }
      });

      return included;
    });

    return newEvents;
  };

  // Replace event with new event details
  const editEvent = newEvent => {
    const newEvents = events.map(e => {
      if (e.id === newEvent.id) {
        return newEvent;
      }
      return e;
    }).sort((a, b) => {
      return a.date.seconds - b.date.seconds;
    }).reverse();

    setEvents(newEvents);
    setFilteredEvents(newEvents);
  }

  return (
    <Layout>
      <Header name="Your Meals" navigation={navigation} hasNotif={unread} />

      <View style={{ marginTop: 20, paddingHorizontal: 20 }}>
        <Searchbar
          placeholder="Search by name, tags, or host name"
          value={searchQuery}
          onChangeText={onChangeText}
        />

        <HorizontalRow>
          <Filter
            checked={publicEvents}
            onPress={publicOnly}
            text="Public"
          />
          <Filter
            checked={privateEvents}
            onPress={privateOnly}
            text="Private"
          />
          <Filter
            checked={fromFriends}
            onPress={() => setFromFriends(!fromFriends)}
            text="From friends"
          />
          <Filter
            checked={friendsAttending}
            onPress={() => setFriendsAttending(!friendsAttending)}
            text="Friends attending"
          />
        </HorizontalRow>
      </View>

      {!loading ? 
        filteredEvents.length > 0 ? (
        <FlatList
          contentContainerStyle={styles.cards}
          keyExtractor={(item) => item.id}
          data={filteredEvents}
          renderItem={({ item }) => (
            <EventCard
              event={item}
              click={() => {
                navigation.navigate("WhileYouEat", {
                  event: item,
                  deleteEvent,
                  editEvent
                });
              }}
            />
          )}
        />
      ) : (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <MediumText center>Empty 🍽️</MediumText>
        </View>)
      : (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <ActivityIndicator size={100} color="#5DB075" />
        </View>
      )}
    </Layout>
  );
}

const styles = StyleSheet.create({
  cards: {
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 40,
  },
});
