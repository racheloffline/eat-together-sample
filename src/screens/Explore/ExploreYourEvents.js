// Display your events

import React, {useEffect, useState} from "react";
import { StyleSheet, FlatList } from "react-native";
import { Layout } from "react-native-rapi-ui";

import EventCard from '../../components/EventCard';
import Header from "../../components/Header";
import Searchbar from "../../components/Searchbar";
import HorizontalSwitch from "../../components/HorizontalSwitch";

import getDate from "../../getDate";
import { db, auth } from "../../provider/Firebase";

export default function({ navigation }) {
    const [events, setEvents] = useState([]); // initial state, function used for updating initial state
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    const user = auth.currentUser;

    useEffect(() => { // updates stuff right after React makes changes to the DOM
        let newEvents = [];

        db.collection("Users").doc(user.uid).get().then(doc => {
            doc.data().attendingEventIDs.forEach(e => {
                if (e.type === "public") {
                    db.collection("Public Events").doc(e.id).get().then(event => {
                        let data = event.data();
                        data.type = e.type;
                        newEvents.unshift(data);
                        setFilteredEvents(newEvents);
                        setEvents(newEvents);
                    });
                } else {
                    db.collection("Private Events").doc(e.id).get().then(event => {
                        let data = event.data();
                        data.type = e.type;
                        newEvents.unshift(data);
                        setFilteredEvents(newEvents);
                        setEvents(newEvents);
                    });
                }
            });
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

    // Deletes event from DOM and updates Firestore
    const deleteEvent = id => {
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
        const newEvents = events.filter(e => e.id !== id);
        const newFilteredEvents = events.filter(e => e.id !== id);
        setEvents(newEvents);
        setFilteredEvents(newFilteredEvents);
    }

    return (
        <Layout>
            <Header name="Explore" navigation = {navigation}/>
            <HorizontalSwitch left="Your Events" right="Public" current="left" press={() => navigation.navigate("Explore")}/>
            <Searchbar placeholder="Search by name, date, location, or additional info"
				value={searchQuery} onChangeText={onChangeText}/>

            <FlatList contentContainerStyle={styles.cards} keyExtractor={item => item.id}
                      data={filteredEvents} renderItem={({item}) =>
                <EventCard event={item} click={() => {
                    navigation.navigate("FullCardPrivate", {
                        event: item,
                        deleteEvent
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