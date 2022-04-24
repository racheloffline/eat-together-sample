//Display upcoming events to join

import React, {useEffect, useState} from "react";
import { View, StyleSheet, FlatList, Dimensions } from "react-native";

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
            const list = [];
            query.forEach((doc) => {
                let data = doc.data();
                if (data.attendees.includes(user.email)) {
                    list.push({
                        id: doc.id,
                        name: data.name,
                        image: "https://static.onecms.io/wp-content/uploads/sites/9/2020/04/24/ppp-why-wont-anyone-rescue-restaurants-FT-BLOG0420.jpg",
                        location: data.location,
                        date: data.date,
                        time: data.time,
                        details: data.description,
                        hostID: "Rachelle Hua",
                        hostImage: "https://e3.365dm.com/16/07/768x432/rtr3cltb-1_3679323.jpg?20160706114211",
                    });
                }
            });
            setEvents(list);
        });
    }, []);

    return (
        <View>
            <Header name="Explore"/>
            <HorizontalSwitch left="Your Events" right="Public" current="left" press={(val) => navigation.navigate("Explore")}/>
            <FlatList contentContainerStyle={styles.cards} keyExtractor={item => item.id}
                      data={events} renderItem={({item}) =>
                <EventCard event={item} click={() => {
                    navigation.navigate("FullCard", {
                        event: item
                    });
                }}/>
            }/>
        </View>
    );
}

const styles = StyleSheet.create({
    cards: {
        alignItems: "center"
    },
});