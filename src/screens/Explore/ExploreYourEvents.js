//Display upcoming events to join

import React, {useEffect, useState} from "react";
import { StyleSheet, FlatList } from "react-native";
import { Layout } from "react-native-rapi-ui";

import EventCard from '../../components/EventCard';
import Header from "../../components/Header";

import {db} from "../../provider/Firebase";
import HorizontalSwitch from "../../components/HorizontalSwitch";
import firebase from "firebase";

export default function({ navigation }) {
    const [events, setEvents] = useState([]); // initial state, function used for updating initial state
    const user = firebase.auth().currentUser;

    useEffect(() => { // updates stuff right after React makes changes to the DOM
        const ref = db.collection("Private Events");
        ref.onSnapshot((query) => {
            let list = [];
            query.forEach(doc => {
                if (doc.data().hostID === user.uid || doc.data().attendees.includes(user.uid)) {
                    list.push(doc.data());
                }
            });
            setEvents(list);
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
                        event: item,
                        public: false
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