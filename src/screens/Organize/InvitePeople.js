//Display upcoming events to join

import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, Dimensions } from "react-native";

import { db, auth, storage } from "../../provider/Firebase";
import { TopNav, Button, Layout } from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";
import firebase from "firebase";

import MediumText from "../../components/MediumText";
import InvitePerson from "../../components/InvitePerson";
import {getProfileRecs} from "../../methods";
import Searchbar from "../../components/Searchbar";
import getDate from "../../getDate";
import {generateColor} from "../../methods";

const storeImage = async (uri, event_id) => {
    const response = await fetch(uri);
    const blob = await response.blob();

    let ref = storage.ref().child("eventPictures/" + event_id);
    return ref.put(blob);
};

async function sendInvites (attendees, invite, navigation, icebreakers) {
    const user = auth.currentUser;
    const id = Date.now() + user.uid;

    //Add photo as necessary
    if (invite.hasImage) {
        await storeImage(invite.image, id);
    }

    //Send invites to each of the selected users
    async function sendInvitations(ref) {
        ref.collection("Invites").add({
            date: invite.date,
            description: invite.additionalInfo,
            hostID: user.uid,
            hostName: hostName,
            hasImage: invite.hasImage,
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
        hostID: user.uid,
        location: invite.location,
        date: invite.date,
        additionalInfo: invite.additionalInfo,
        ice: icebreakers,
        attendees: [user.uid], //ONLY start by putting the current user as an attendee
        hasImage: invite.hasImage
    }).then(async docRef => {
        await attendees.forEach((attendee) => {
            const ref = db.collection("User Invites").doc(attendee);
            ref.get().then(async (docRef) => {
                if (attendee !== user.uid) {
                    await sendInvitations(ref)
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


const isMatch = (user, text) => {
    if (user.name.toLowerCase().includes(text.toLowerCase())) { // Name
        return true;
    }

    if (user.username.toLowerCase().includes(text.toLowerCase())) { // Location
        return true;
    }

    if (user.quote.toLowerCase().includes(text.toLowerCase())) { // Date
        return true;
    }

    return false;
}

export default function({ route, navigation }) {
    const [users, setUsers] = useState([]); // initial state, function used for updating initial state
    const [filteredUsers, setFilteredUsers] = useState([]);
    const attendees = route.params.attendees;
    const [curSearch, setCurSearch] = useState("");
    const [image, setImage] = useState(null);
    const [icebreakers, setIcebreakers] = useState([]);

    const onChangeText = (text) => {
        setCurSearch(text);
        search(curSearch);
    }

    const search = (text) => {
        let newEvents = users.filter(e => isMatch(e, text));
        setFilteredUsers(newEvents);
    }


    useEffect(() => { // updates stuff right after React makes changes to the DOM
        //LINKING ELAINE'S ALGO
        /*
        let bestUsers = getProfileRecs();
        const ref = db.collection("Users");
        const list = [];
        bestUsers.forEach((user) => {
            ref.doc(user).get().then((doc) => {
                let data = doc.data();
                list.push({
                    id: doc.id,
                    hostID: data.id,
                    name: data.name,
                    quote: data.quote,
                    profile: "https://e3.365dm.com/16/07/768x432/rtr3cltb-1_3679323.jpg?20160706114211",
                    attendees: data.attendees
                });
                setUsers(list);
            });
        });
         */
        // COMMENT THIS AREA OUT WHEN READY (START)
//      picks icebreaker set from set of icebreakers randomly
        const breakOptions = [];
        db.collection("Icebreakers").onSnapshot((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                breakOptions.push(doc.id);
                console.log(doc.id);
                console.log("IS THIS WORKING?????")
            })
            console.log(breakOptions);
            var num = Math.floor(Math.random()*breakOptions.length);
            db.collection("Icebreakers").doc(breakOptions[num]).get().then(doc => {
                    console.log("please be working!!!!");
                    setIcebreakers(doc.data().icebreakers);
                })
        });

        const ref = db.collection("Users");
        const user = firebase.auth().currentUser;
        ref.onSnapshot((query) => {
            const list = [];
            query.forEach((doc) => {
                let data = doc.data();
                if (data.verified && data.id !== user.uid) {
                    list.push({
                        id: doc.id,
                        username: data.username,
                        personID: data.id,
                        name: data.name,
                        quote: data.quote,
                        hasImage: data.hasImage,
                        attendees: data.attendees,
                        tags: data.tags,
                        attendedEventIDs: data.attendedEventIDs,
                        attendingEventIDs: data.attendingEventIDs
                    });
                }
            });
            setFilteredUsers(list);
            setUsers(list);
        });
        // COMMENT THIS AREA OUT WHEN READY (END)
    }, []);

    return (
        <Layout style={{flex:1}}>
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
                <Searchbar placeholder="Search by name, date, location, or additional info"
                           value={curSearch} onChangeText={onChangeText}/>
            <FlatList contentContainerStyle={styles.invites} keyExtractor={item => item.id}
                      data={filteredUsers} renderItem={({item}) =>
                <InvitePerson navigation={navigation} person={item} attendees={attendees} color={generateColor()}/>
            }/>
            <View style={styles.buttons}>
                <Button text="Send Invites" width={Dimensions.get('screen').width} color="#5DB075" size="lg" onPress={async () => {
                    await sendInvites(attendees, route.params, navigation, icebreakers);
                }}/>
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

