//Display upcoming events to join

import React, {useEffect, useState} from "react";
import { StyleSheet, FlatList } from "react-native";
import { Layout } from "react-native-rapi-ui";

import EventCard from '../../components/EventCard';
import Header from "../../components/Header";

import { db, auth } from "../../provider/Firebase";
import HorizontalSwitch from "../../components/HorizontalSwitch";

export default function({ navigation }) {
    const [events, setEvents] = useState([]); // initial state, function used for updating initial state
    const user = auth.currentUser;

    useEffect(() => { // updates stuff right after React makes changes to the DOM
        db.collection("Users").doc(user.uid).get().then(doc => {
            doc.data().attendingEventIDs.forEach(e => {
                if (e.type === "public") {
                    db.collection("Public Events").doc(e.id).get().then(event => {
                        let data = event.data();
                        data.type = e.type;
                        setEvents(events => ([...events, data]));
                    });
                } else {
                    db.collection("Private Events").doc(e.id).get().then(event => {
                        let data = event.data();
                        data.type = e.type;
                        setEvents(events => ([...events, data]));
                    });
                }
            });
        });
    }, []);

    return (
        <Layout>
            <Header name="Explore" navigation = {navigation}/>
            <HorizontalSwitch left="Your Events" right="Public" current="left" press={(val) => navigation.navigate("Explore")}/>
            <FlatList contentContainerStyle={styles.cards} keyExtractor={item => item.id}
                      data={events} renderItem={({item}) =>
                <EventCard event={item} click={() => {
                    navigation.navigate("FullCardPrivate", {
                        event: item
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