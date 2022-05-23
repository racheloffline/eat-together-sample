import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Image, Dimensions, TouchableOpacity, ScrollView} from "react-native";
import {Layout, Text, TopNav} from "react-native-rapi-ui";
import {Ionicons} from "@expo/vector-icons";
import MediumText from "../../components/MediumText";
import NormalText from "../../components/NormalText";
import firebase from "firebase";
import {db, storage} from "../../provider/Firebase";

export default function ({ route, navigation}) {
    //Save the invite as a shorter name
    const [image, setImage] = useState("");
    let invite = route.params.invite;

    //Get the current user and firebase ref path
    const user = firebase.auth().currentUser;
    const ref = db.collection("User Invites").doc(user.uid).collection("Invites").doc(invite.id);

    useEffect(() => {
        if (invite.hasImage) {
            storage.ref("eventPictures/" + invite.inviteID).getDownloadURL().then(uri => {
                setImage(uri);
            });
        }
    }, [])

    //Check to see if there's any details to display
    function displayDetails() {
        if(invite.details == null || invite.details === "") {
            return "None provided."
        } else {
            return invite.details
        }
    }

    return (
        <Layout>
            <TopNav
                middleContent="View Invite"
                leftContent={
                    <Ionicons
                        name="chevron-back"
                        size={20}
                    />
                }
                leftAction={() => navigation.goBack()}
            />
            <ScrollView contentContainerStyle={styles.page}>
                <View style={styles.background}/>
                <Image style={styles.image}
                       source={{uri: (image != "" ? image : "https://images.unsplash.com/photo-1504674900247-0877df9cc836?crop=entropy&cs=tinysrgb&fm=jpg&ixlib=rb-1.2.1&q=60&raw_url=true&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8Zm9vZHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=1400")}}/>
                <MediumText style={styles.text}>{invite.hostName} is inviting you to {invite.name}!</MediumText>
                <View style = {styles.icons}>
                    <Ionicons name="location-outline" size={24}/>
                    <Text>  </Text>
                    <NormalText size = {20}>{invite.location}</NormalText>
                </View>
                <View style = {styles.icons}>
                    <Ionicons name="calendar-outline" size={24}/>
                    <Text>  </Text>
                    <NormalText size = {20}>{invite.date}</NormalText>
                </View>
                <View style = {styles.icons}>
                    <Ionicons name="time-outline" size={24}/>
                    <Text>  </Text>
                    <NormalText size = {20}>{invite.time}</NormalText>
                </View>
                <View style = {styles.text}>
                    <NormalText size = {20}>Details: {displayDetails()}</NormalText>
                </View>

                <View style = {styles.buttonView}>
                    <TouchableOpacity onPress = {() => {
                        ref.set({
                            accepted: "accepted"
                        }, {merge: true}).then(() => {
                            const inviteRef = db.collection("Private Events").doc(invite.inviteID)
                            inviteRef.get().then((doc) => {
                                let data = doc.data()
                                let currentAttendees = data.attendees
                                if(!currentAttendees.includes(user.uid)) {
                                    currentAttendees.push(user.uid)
                                    inviteRef.set({
                                        attendees: currentAttendees
                                    }, {merge: true}).then(() => {
                                        const storeID = {
                                            type: "private",
                                            id: invite.inviteID
                                        };

                                        db.collection("Users").doc(user.uid).update({
                                            attendingEventIDs: firebase.firestore.FieldValue.arrayUnion(storeID)
                                        }).then(() => {
                                            alert("Invite Accepted!");
                                            navigation.goBack();
                                        });
                                    })
                                } else {
                                    alert("Invite already accepted.");
                                }

                            })
                        })
                    }}>
                        <NormalText size = {18} color = {"green"} center = "center">Accept Invite</NormalText>
                    </TouchableOpacity>
                    <TouchableOpacity style = {{paddingVertical: 10}} onPress = {() => {
                        ref.set({
                            accepted: "declined"
                        }, {merge: true}).then(() => {
                            const storeID = {
                                type: "private",
                                id: invite.inviteID
                            };

                            db.collection("Users").doc(user.uid).update({
                                attendingEventIDs: firebase.firestore.FieldValue.arrayRemove(storeID)
                            }).then(() => {
                                db.collection("Private Events").doc(invite.inviteID).update({
                                    attendees: firebase.firestore.FieldValue.arrayRemove(user.uid)
                                }).then(() => {
                                    alert("Invite Declined");
                                    navigation.goBack();
                                })
                            });
                        })
                    }}>
                        <NormalText size = {18} color = {"red"} center = "center">Decline Invite</NormalText>
                    </TouchableOpacity>
                    <TouchableOpacity onPress = {() => {
                        ref.delete().then(r => {
                            alert("Invite Cleared")
                            navigation.goBack();
                        })
                    }}>
                        <NormalText size = {18} color = {"blue"} center = "center">Clear Invite</NormalText>
                    </TouchableOpacity>
                </View>



            </ScrollView>
        </Layout>
    );
}

const styles = StyleSheet.create({
    page: {
        paddingTop: 30,
        alignItems: "center",
        paddingHorizontal: 10
    },

    background: {
        position: "absolute",
        width: Dimensions.get('screen').width,
        height: 100,
        backgroundColor: "#5DB075"
    },

    image: {
        width: Dimensions.get('screen').width - 20,
        height: 200,
        borderRadius: 10
    },

    text: {
        alignItems: "flex-start",
        flexDirection: "row",
        width: Dimensions.get('screen').width - 40,
        paddingVertical: 25
    },

    icons: {
        alignItems: "flex-start",
        flexDirection: "row",
        width: Dimensions.get('screen').width - 40,
        paddingVertical: 5
    },

    buttonView: {
        display: "flex",
        alignSelf: "center",
        paddingVertical: 15
    }

});