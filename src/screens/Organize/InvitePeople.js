//Display upcoming events to join

import React, {useEffect, useState} from "react";
import {View, StyleSheet, FlatList, Dimensions} from "react-native";

import { db, auth } from "../../provider/Firebase";
import {TopNav, Button, TextInput} from "react-native-rapi-ui";
import {FontAwesome, Ionicons} from "@expo/vector-icons";
import firebase from "firebase";

import MediumText from "../../components/MediumText";
import InvitePerson from "../../components/InvitePerson";

const generateColor = () => {
    const randomColor = Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, '0');
    return `#${randomColor}`;
};

async function sendInvites (attendees, invite, navigation) {
    const user = auth.currentUser;
    const id = Date.now() + user.uid;

    //Send invites to each of the selected users
    async function sendInvitations(ref) {
        ref.collection("Invites").add({
            date: invite.date,
            description: invite.additionalInfo,
            hostID: user.uid,
            hostName: hostName,
            hasImage: invite.hasImage,
            image: "",
            location: invite.location,
            name: invite.name,
            inviteID: id
        }).then(r => {
            invite.clearAll();
            navigation.navigate("OrganizePrivate");
        })
    }

    let hostName;

    await db.collection("Users").doc(user.uid).get().then((snapshot) => {
        hostName = snapshot.data().name
    })

    db.collection("Private Events").doc(id).set({
        id,
        name: invite.name,
        location: invite.location,
        date: invite.date,
        additionalInfo: invite.additionalInfo,
        attendees: [user.uid], //ONLY start by putting the current user as an attendee
        hasImage: false
    }).then(async docRef => {
        await attendees.forEach((attendee) => {
            const ref = db.collection("User Invites").doc(attendee);
            ref.get().then((docRef) => {
                if (docRef.exists && (attendee !== user.uid)) {
                    sendInvitations(ref)
                }
            })

        })

        const storeID = {
            type: "private",
            id
        };

        await db.collection("Users").doc(user.uid).update({
            hostedEventIDs: firebase.firestore.FieldValue.arrayUnion(storeID),
            attendingEventIDs: firebase.firestore.FieldValue.arrayUnion(storeID),
            attendedEventIDs: firebase.firestore.FieldValue.arrayUnion(storeID)
        })

        alert("Invitations sent!");

    })
};

export default function({ route, navigation }) {
    const [users, setUsers] = useState([]); // initial state, function used for updating initial state
    const attendees = route.params.attendees;
    const [curSearch, setCurSearch] = useState("");

    useEffect(() => { // updates stuff right after React makes changes to the DOM
        const ref = db.collection("Users");
        const user = auth.currentUser;
        ref.onSnapshot((query) => {
            const list = [];
            query.forEach((doc) => {
                let data = doc.data();
                list.push({
                    id: doc.id,
                    hostID: data.id,
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
            <View style={styles.tagInput}>
                <TextInput placeholder="Or search by username" value={curSearch}
                           containerStyle={styles.input} onChangeText={val => setCurSearch(val)}
                           leftContent={<FontAwesome name="search" size={18}/>}/>
                <Button text="Go" color="#5DB075" onPress={()=> {
                    const user = auth.currentUser;
                    db.collection("Users").doc(user.uid).get().then((doc) => {
                        if (curSearch === doc.data().username) {
                            alert("No need to invite yourself.")
                            return;
                        }
                        db.collection("Users").limit(1).where("username", "==", curSearch).get().then((snapshot) => {
                            if (!snapshot.empty) {
                                const doc = snapshot.docs[0];
                                const data = doc.data();
                                setUsers([{
                                    id: doc.id,
                                    name: data.name,
                                    quote: data.quote,
                                    hostID: user.uid,
                                    profile: "https://e3.365dm.com/16/07/768x432/rtr3cltb-1_3679323.jpg?20160706114211"
                                }]);
                            } else {
                                alert("Username not found.");
                            }
                        });
                    })
                }} disabled={curSearch === ""}/>
            </View>
            <FlatList contentContainerStyle={styles.invites} keyExtractor={item => item.id}
                      data={users} renderItem={({item}) =>
                <InvitePerson person={item} attendees={attendees} color={generateColor()}/>
            }/>
            <View style={styles.buttons}>
                <Button text="Send Invites" width={200} color="#5DB075" size="lg" onPress={() => sendInvites(attendees, route.params)}/>
                <Button color="#5DB075" outline width={200} text="Done" onPress={()=> navigation.navigate("OrganizePrivate")}/>
            </View>
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
    },
    tagInput: {
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        marginVertical: 10
    },

    input: {
        width: Dimensions.get('screen').width/1.5,
        marginRight: 10
    },
    buttons: {
        justifyContent: "center",
        flexDirection: "row"
    }
});