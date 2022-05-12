//Display upcoming events to join

import React, {useEffect, useState} from "react";
import { StyleSheet, FlatList } from "react-native";
import { Layout } from "react-native-rapi-ui";

import EventCard from '../../components/EventCard';
import Header from "../../components/Header";

import { db, storage } from "../../provider/Firebase";
import HorizontalSwitch from "../../components/HorizontalSwitch";
import {Layout} from "react-native-rapi-ui";

export default function({ navigation }) {
    const [events, setEvents] = useState([]); // initial state, function used for updating initial state

    useEffect(() => { // updates stuff right after React makes changes to the DOM
      const ref = db.collection("Public Events");
      ref.onSnapshot((query) => {
        let newEvents = [];
        query.forEach((doc) => {
          newEvents.push(doc.data());
        });

        setEvents(newEvents);
      });
    }, []);

    return (
      <Layout>
        <Header name="Explore" navigation = {navigation}/>
        <HorizontalSwitch left="Your Events" right="Public" current="right" press={(val) => navigation.navigate("ExploreYourEvents")}/>
        <FlatList contentContainerStyle={styles.cards} keyExtractor={item => item.id}
        data={events} renderItem={({item}) =>
          <EventCard event={item} click={() => {
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
