//Look at your connections and connection requests

import React, {useEffect, useState} from 'react';
import {Layout, Text, TopNav} from 'react-native-rapi-ui';
import {Ionicons} from "@expo/vector-icons";
import HorizontalSwitch from "../../components/HorizontalSwitch";
import PeopleList from "../../components/PeopleList";
import {FlatList, StyleSheet} from "react-native";
import {generateColor} from "../../methods";
import {db} from "../../provider/Firebase";
import firebase from "firebase";
import MessageList from "../../components/MessageList";

export default function ({ navigation }) {
    const user = firebase.auth().currentUser;
    const [requests, setRequests] = useState([]); // initial state, function used for updating initial state

    useEffect(() => { // updates stuff right after React makes changes to the DOM
        const ref = db.collection("User Invites").doc(user.uid).collection("Connections");
        ref.onSnapshot((query) => {
            const list = [];
            query.forEach((doc) => {
                let data = doc.data();
                list.push({
                    id: doc.id,
                    name: data.name,
                    username: data.username,
                    profile: "https://e3.365dm.com/16/07/768x432/rtr3cltb-1_3679323.jpg?20160706114211"
                });
            });
            setRequests(list);
        });
    }, []);

    return (
        <Layout>
            <TopNav
                middleContent="Connections"
                leftContent={
                    <Ionicons
                        name="chevron-back"
                        size={20}
                    />
                }
                leftAction={() => navigation.navigate("Explore")}
            />
            <HorizontalSwitch left="Connections" right="Requests" current="right" press={(val) => navigation.navigate("Connections")}/>
            <FlatList contentContainerStyle={styles.invites} keyExtractor={item => item.id}
                      data={requests} renderItem={({item}) =>
                <MessageList person={item} color={generateColor()}/>
            }/>
        </Layout>

    );
}

const styles = StyleSheet.create({
    invites: {
        alignItems: "center",
        padding: 30
    },
    submit: {
        position: 'absolute',
        bottom:0,
    }
});

