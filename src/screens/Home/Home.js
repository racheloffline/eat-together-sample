// Display your events

import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, StyleSheet, FlatList } from "react-native";
import { Layout } from "react-native-rapi-ui";

import EventCard from "../../components/EventCard";
import Header from "../../components/Header";
import Searchbar from "../../components/Searchbar";
import HorizontalRow from "../../components/HorizontalRow";
import Filter from "../../components/Filter";

import getDate from "../../getDate";
import { db, auth } from "../../provider/Firebase";

export default function ({ navigation }) {
  // Get current user
  const user = auth.currentUser;

  const [events, setEvents] = useState([]); // initial state, function used for updating initial state
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Filters
  const [publicEvents, setPublicEvents] = useState(false);
  const [privateEvents, setPrivateEvents] = useState(false);

  const [unread, setUnread] = useState(false); // See if we need to display unread notif icon
  const [loading, setLoading] = useState(true); // State variable to show loading screen when fetching data

  useEffect(() => {
    // updates stuff right after React makes changes to the DOM
    let newEvents = [];
    let userInfo;

    async function fetchEvents() {
      await db
        .collection("Users")
        .doc(user.uid)
        .get()
        .then((doc) => {
          setUnread(doc.data().hasNotif);
          userInfo = doc.data();
        })
        .then(() => {
          let eventsLength = userInfo.attendingEventIDs.length;

          userInfo.attendingEventIDs.forEach((e) => {
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
              });
          });
        });
    }

    fetchEvents().then(() => {
      setLoading(false);
    });
  }, []);

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
  };

  // Determines if an event
  const isMatch = (event, text) => {
    if (event.name.toLowerCase().includes(text.toLowerCase())) {
      // Name
      return true;
    }

    if (event.location.toLowerCase().includes(text.toLowerCase())) {
      // Location
      return true;
    }

    if (
      getDate(event.date.toDate()).toLowerCase().includes(text.toLowerCase())
    ) {
      // Date
      return true;
    }

    return event.hostName.toLowerCase().includes(text.toLowerCase()); // Host
  };

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
    if (!publicEvents) {
      setFilteredEvents(events.filter((e) => e.type === "public"));
    } else {
      setFilteredEvents(events);
    }

    setPublicEvents(!publicEvents);
    setPrivateEvents(false);
  };

  // Display private events only
  const privateOnly = () => {
    if (!privateEvents) {
      setFilteredEvents(events.filter((e) => e.type === "private"));
    } else {
      setFilteredEvents(events);
    }

    setPrivateEvents(!privateEvents);
    setPublicEvents(false);
  };
  return (
    <Layout>
      <View style={{ padding: 20 }}>
        <Header name="Your Events" navigation={navigation} hasNotif={unread} />
      </View>
      <Searchbar
        placeholder="Search by name, location, date, or host name"
        value={searchQuery}
        onChangeText={onChangeText}
      />

      <HorizontalRow>
        <Filter
          checked={publicEvents}
          onPress={publicOnly}
          text="Public events"
        />
        <Filter
          checked={privateEvents}
          onPress={privateOnly}
          text="Private events"
        />
      </HorizontalRow>

      {!loading ? (
        <FlatList
          contentContainerStyle={styles.cards}
          keyExtractor={(item) => item.id}
          data={filteredEvents}
          renderItem={({ item }) => (
            <EventCard
              event={item}
              click={() => {
                navigation.navigate("FullCardPrivate", {
                  event: item,
                  deleteEvent,
                });
              }}
            />
          )}
        />
      ) : (
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
