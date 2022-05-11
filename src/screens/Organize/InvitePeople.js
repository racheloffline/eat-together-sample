//Display upcoming events to join

import React, {useEffect, useState} from "react";
import {View, StyleSheet, FlatList} from "react-native";

import EventCard from '../../components/EventCard';
import Header from "../../components/Header";

import { db, auth } from "../../provider/Firebase";
import {TopNav, Button} from "react-native-rapi-ui";
import {Ionicons} from "@expo/vector-icons";
import InvitePerson from "../../components/InvitePerson";

const generateColor = () => {
    const randomColor = Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, '0');
    return `#${randomColor}`;
};

const sendInvites = (attendees, invite, navigation) => {
    const user = auth.currentUser;
    const id = Date.now() + user.uid;

    db.collection("Private Events").doc(id).set({
        id,
        name: invite.name,
        location: invite.location,
        date: invite.date,
        additionalInfo: invite.additionalInfo,
        attendees: attendees,
        hasImage: false
    }).then(r => {
        alert("Invitations sent!");
        invite.clearAll();
        navigation.navigate("OrganizePrivate");
    });
};

export default function({ route, navigation }) {
    const [users, setUsers] = useState([]); // initial state, function used for updating initial state
    const attendees = route.params.attendees;

    useEffect(() => { // updates stuff right after React makes changes to the DOM
        const ref = db.collection("Users");
        ref.onSnapshot((query) => {
            const list = [];
            query.forEach((doc) => {
                let data = doc.data();
                list.push({
                    id: doc.id,
                    name: data.name,
                    quote: data.quote,
                    profile: "https://e3.365dm.com/16/07/768x432/rtr3cltb-1_3679323.jpg?20160706114211",
                    attendees: data.attendees
                });
            });
            setUsers(list);
        });
    }, []);

    return (
        <View style={{flex:1}}>
            <TopNav
                middleContent={
                    <MediumText center>Suggested People</MediumText>
                  }
                leftContent={
                    <Ionicons
                        name="chevron-back"
                        size={20}
                    />
                }
                leftAction={() => navigation.goBack()}
            />
            <FlatList contentContainerStyle={styles.invites} keyExtractor={item => item.id}
                      data={users} renderItem={({item}) =>
                <InvitePerson person={item} attendees={attendees} color={generateColor()}/>
            }/>
            <Button text="Send Invites" status="success" size="lg" onPress={() => sendInvites(attendees, route.params, navigation)}/>
        </View>
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