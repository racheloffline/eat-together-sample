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
import {View} from "react-native";
import NormalText from "../../components/NormalText";
import MediumText from "../../components/MediumText";

export default function ({ navigation }) {
    const user = firebase.auth().currentUser;
    const [requests, setRequests] = useState([]); // initial state, function used for updating initial state

    //Check to see if we should display the "No Requests" placeholder text
    function shouldDisplayPlaceholder(list) {
        if(list == null ||list.length === 0) {
            return "No connections. Meet friends on the People page!"
        } else {
            return ""
        }
    }

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
                middleContent={
                    <MediumText center>Connections</MediumText>
                }
                leftContent={
                    <Ionicons
                        name="chevron-back"
                        size={20}
                    />
                }
                leftAction={() => navigation.navigate("Invite")}
            />
            <View style={styles.switchView}>
                <HorizontalSwitch left="Connections" right="Requests" current="right" press={(val) => navigation.navigate("Connections")}/>
            </View>
            <View style = {styles.noRequestsView}>
                <NormalText center={"center"}>{shouldDisplayPlaceholder(requests)}</NormalText>
            </View>
            <View style={styles.list}>
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
            </View>
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
        marginVertical: -20
    },
    list: {
        marginVertical: -20
    }
});

