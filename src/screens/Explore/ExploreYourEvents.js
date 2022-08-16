// Display your events

import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, StyleSheet, FlatList } from "react-native";
import { Layout } from "react-native-rapi-ui";

import EventCard from "../../components/EventCard";
import Header from "../../components/Header";
import Searchbar from "../../components/Searchbar";
import HorizontalSwitch from "../../components/HorizontalSwitch";
import HorizontalRow from "../../components/HorizontalRow";
import Filter from "../../components/Filter";

import MediumText from "../../components/MediumText";

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
    
    return event.hostFirstName.toLowerCase().includes(text.toLowerCase())
      || event.hostLastName.toLowerCase().includes(text.toLowerCase());
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
    if (!publicEvents) {
      setFilteredEvents(events.filter((e) => e.type === "public"));
    } else {
      setFilteredEvents(events);
    }

    setPublicEvents(!publicEvents);
    setPrivateEvents(false);
    setSearchQuery("");
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
    setSearchQuery("");
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
      <Header name="Explore" navigation={navigation} hasNotif={unread} />
      <HorizontalSwitch
        left="Your Meals"
        right="Public"
        current="left"
        press={() => navigation.navigate("Explore")}
      />

      <View style={{ paddingHorizontal: 20 }}>
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
                navigation.navigate("FullCardPrivate", {
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
