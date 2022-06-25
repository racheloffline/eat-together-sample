//Display upcoming events to join

import React, {useEffect, useState} from "react";
import { StyleSheet, FlatList } from "react-native";
import { Layout } from "react-native-rapi-ui";

import EventCard from '../../components/EventCard';
import Header from "../../components/Header";
import HorizontalSwitch from "../../components/HorizontalSwitch";
import Searchbar from "../../components/Searchbar";

import getDate from "../../getDate";
import { db } from "../../provider/Firebase";

export default function({ navigation }) {
    const [events, setEvents] = useState([]); // initial state, function used for updating initial state
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => { // updates stuff right after React makes changes to the DOM
      const ref = db.collection("Public Events");
      ref.onSnapshot((query) => {
        let newEvents = [];
        query.forEach((doc) => {
          newEvents.push(doc.data());
        });

        setEvents(newEvents);
        setFilteredEvents(newEvents);
      });
    }, []);

    // Method to filter out events
    const search = text => {
      let newEvents = events.filter(e => isMatch(e, text));
      setFilteredEvents(newEvents);
    }

    // Determines if an event
    const isMatch = (event, text) => {
      if (event.name.toLowerCase().includes(text.toLowerCase())) { // Name
        return true;
      }

      if (event.location.toLowerCase().includes(text.toLowerCase())) { // Location
        return true;
      }

      if (getDate(event.date.toDate()).toLowerCase().includes(text.toLowerCase())) { // Date
        return true;
      }

      return event.additionalInfo.toLowerCase().includes(text.toLowerCase()); // Additional info
    }

    // Method called when a new query is typed in/deleted
    const onChangeText = text => {
      setSearchQuery(text);
      search(text);
    }

    return (
      <Layout>
        <Header name="Explore" navigation = {navigation}/>
        <HorizontalSwitch left="Your Events" right="Public" current="right" press={() => navigation.navigate("ExploreYourEvents")}/>
        <Searchbar placeholder="Search by name, date, location, or additional info"
				  value={searchQuery} onChangeText={onChangeText}/>

        <FlatList contentContainerStyle={styles.cards} keyExtractor={item => item.id}
        data={filteredEvents} renderItem={({item}) =>
          <EventCard event={item} click={() => {
              //ampInstance.logEvent('BUTTON_CLICKED'); // EXPERIMENT
            navigation.navigate("FullCard", {
              event: item,
              public: true
            });
          }}/>
        }/>
      </Layout>
    );
}

const styles = StyleSheet.create({
  cards: {
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 40
  },
});
