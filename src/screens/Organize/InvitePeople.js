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

// Stores image in Firebase Storage
const storeImage = async (uri, event_id) => {
    const response = await fetch(uri);
    const blob = await response.blob();

    let ref = storage.ref().child("eventPictures/" + event_id);
    return ref.put(blob);
};

// Fetches image from Firebase Storage
const fetchImage = async (id) => {
    let ref = storage.ref().child("eventPictures/" + id);
    return ref.getDownloadURL();
}

async function sendInvites (attendees, invite, navigation, user, id, image) {
    //Send invites to each of the selected users
    async function sendInvitations(ref) {
        ref.collection("Invites").add({
            date: invite.date,
            description: invite.additionalInfo,
            hostID: user.id,
            hostName: user.firstName + " " + user.lastName,
            hasImage: invite.hasImage,
            location: invite.location,
            name: invite.name,
            inviteID: id
        }).then(r => {
            invite.clearAll();
            navigation.navigate("OrganizePrivate");
        });
    }

    db.collection("Private Events").doc(id).set({
        id,
        name: invite.name,
        hostID: user.id,
        hostFirstName: user.firstName,
        hostLastName: user.lastName,
        hasHostImage: user.hasImage,
        hostImage: user.image,
        location: invite.location,
        date: invite.date,
        additionalInfo: invite.additionalInfo,
        attendees: [user.id], //ONLY start by putting the current user as an attendee
        hasImage: invite.hasImage,
        image
    }).then(async docRef => {
        await attendees.forEach((attendee) => {
            const ref = db.collection("User Invites").doc(attendee);
            ref.get().then(async (docRef) => {
                if (attendee !== user.uid) {
                    await sendInvitations(ref)
                }
            });
        });

        const storeID = {
            type: "private",
            id
        };

        await db.collection("Users").doc(user.uid).update({
            hostedEventIDs: firebase.firestore.FieldValue.arrayUnion(storeID),
            attendingEventIDs: firebase.firestore.FieldValue.arrayUnion(storeID),
            attendedEventIDs: firebase.firestore.FieldValue.arrayUnion(storeID)
        });

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
    // Current user
    const user = auth.currentUser;
    const [userInfo, setUserInfo] = useState([]);

    const attendees = route.params.attendees;

    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [curSearch, setCurSearch] = useState("");
    
    const [disabled, setDisabled] = useState(true);
    const [loading, setLoading] = useState(false);

    // Loading data
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
                } else if (data.id === user.uid) {
                    setUserInfo(data);
                }
            });
            setFilteredUsers(list);
            setUsers(list);
        });
        // COMMENT THIS AREA OUT WHEN READY (END)
    }, []);

    const onChangeText = (text) => {
        setCurSearch(text);
        search(curSearch);
    }

    const search = (text) => {
        let newEvents = users.filter(e => isMatch(e, text));
        setFilteredUsers(newEvents);
    }

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

            <Searchbar placeholder="Search by name"
                value={curSearch} onChangeText={onChangeText}/>
            <FlatList contentContainerStyle={styles.invites} keyExtractor={item => item.id}
                data={filteredUsers} renderItem={({item}) =>
                    <InvitePerson navigation={navigation} person={item}
                        attendees={attendees} color={generateColor()}
                        disable={() => setDisabled(true)}
                        undisable={() => setDisabled(false)}/>
                }/>

            <View style={styles.buttons}>
                <Button text={loading ? "Sending ..." : "Send Invites"} width={Dimensions.get('screen').width}
                    disabled={disabled || loading} color="#5DB075" size="lg" onPress={() => {
                        setLoading(true);
                        const id = Date.now() + user.uid; // Generate a unique ID for the event
                        
                        if (route.params.hasImage) {
                            storeImage(route.params.image, id).then(() => {
                                fetchImage(id).then(uri => {
                                    sendInvites(attendees, route.params, navigation, userInfo, id, uri).then(() => {
                                        setLoading(false);
                                    })
                                });
                            });
                        } else {
                            sendInvites(attendees, route.params, navigation, user, id, "").then(() => {
                                setLoading(false);
                            });
                        }
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
