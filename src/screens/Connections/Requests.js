//Look at your connections and connection requests

import React, {useEffect, useState} from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { Layout, TopNav } from 'react-native-rapi-ui';
import { Ionicons } from "@expo/vector-icons";

import MessageList from "../../components/MessageList";
import NormalText from "../../components/NormalText";
import MediumText from "../../components/MediumText";

import {generateColor} from "../../methods";
import {db} from "../../provider/Firebase";
import firebase from "firebase/compat";

export default function ({ back, navigation }) {
    const user = firebase.auth().currentUser;
    const [requests, setRequests] = useState([]); // Requests
    const [loading, setLoading] = useState(true); // Loading state for the page

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
            setLoading(false);
        });
    }, []);

    return (
        <Layout>
            <TopNav
                middleContent={
                    <MediumText center>Requests</MediumText>
                }
                leftContent={
                    <Ionicons
                        name="chevron-back"
                        size={20}
                    />
                }
                leftAction={() => navigation.goBack()}
            />

            {loading ?
                <View style={styles.noRequestsView}>
                    <ActivityIndicator size={100} color="#5DB075" />
                    <MediumText>Hang tight ...</MediumText>
                </View>
            : requests.length > 0 ?
                <FlatList contentContainerStyle={styles.invites} keyExtractor={item => item.id}
                        data={requests} renderItem={({item}) =>
                    <MessageList person={item} color={generateColor()} click={() => {
                        db.collection("Users").doc(item.id).get().then((doc) => {
                            navigation.navigate("FullProfile", {
                                person: doc.data()
                            });
                        })
                    }}/>
                }/>
            :
                <View style={styles.noRequestsView}>
                    <MediumText center={"center"}>No requests. You look great today :)</MediumText>
                </View>
            }
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
    },
    switchView: {
        marginVertical: 10
    },
    noRequestsView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

