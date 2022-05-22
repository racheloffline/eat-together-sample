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
                    profile: data.profile
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
                leftAction={() => navigation.navigate("Invite")}
            />
            <HorizontalSwitch left="Connections" right="Requests" current="right" press={(val) => navigation.navigate("Connections")}/>
            <FlatList contentContainerStyle={styles.invites} keyExtractor={item => item.id}
                      data={requests} renderItem={({item}) =>
                <MessageList person={item} color={generateColor()} click={() => {
                    navigation.navigate("FullProfile", {
                        person: {
                            id: item.id,
                            name: item.name,
                            image: item.profile,
                            quote: "There is no sunrise so beautiful that it is worth waking me up to see it.",
                            tags: [
                                "Not here to date",
                                "Brawl Stars",
                                "Rock music",
                                "Lover of Mexican food",
                                "Memes",
                                "Extroverted",
                                "Outgoing"
                            ]
                        }
                    })
                }
                }/>
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

