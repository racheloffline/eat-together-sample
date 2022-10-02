import React from 'react';
import {
    View,
    StyleSheet,
    Dimensions,
    ScrollView,
    ImageBackground,
    Image
} from "react-native";
import {Layout, TopNav} from "react-native-rapi-ui";
import {Ionicons} from "@expo/vector-icons";

import LargeText from "../../components/LargeText";
import MediumText from "../../components/MediumText";
import NormalText from "../../components/NormalText";
import Button from '../../components/Button';
import Link from "../../components/Link";

import firebase from "firebase/compat";
import { db } from "../../provider/Firebase";
import { Menu, MenuOption, MenuOptions, MenuTrigger } from "react-native-popup-menu";
import getDate from '../../getDate';
import getTime from '../../getTime';
import openMap from "react-native-open-maps";

export default function ({ route, navigation}) {
    //Save the invite as a shorter name
    let invite = route.params.invite;

    //Get the current user and firebase ref path
    const user = firebase.auth().currentUser;
    const ref = db.collection("User Invites").doc(user.uid).collection("Invites").doc(invite.id);

    function chooseColor() {
        return route.params.hasPassed ? "red" : "black";
    }

    function reportInvite() {
        navigation.navigate("ReportInvite", {
            inviteID: invite.id,
        });
    }

    return (
        <Layout>
            <TopNav
                middleContent={
                <MediumText>View Invite</MediumText>
                }
                leftContent={
                    <Ionicons
                        name="chevron-back"
                        size={20}
                    />
                }
                rightContent={
                    <View>
                        <Menu>
                            <MenuTrigger>
                                <Ionicons
                                    name="ellipsis-horizontal"
                                    size={25}
                                />
                            </MenuTrigger>
                            <MenuOptions>
                                <MenuOption onSelect={() => reportInvite()} style={styles.option}>
                                    <NormalText size={18} color="red">Report Event</NormalText>
                                </MenuOption>
                            </MenuOptions>
                        </Menu>
                    </View>
                }
                leftAction={() => navigation.goBack()}
            />
            <ScrollView contentContainerStyle={styles.page}>
                <ImageBackground
                    style={styles.imageBackground}
                    resizeMode="cover"
                    source={invite.hasImage ? {uri: invite.image} : require("../../../assets/stockEvent.png")}
                />

                <View style={styles.infoContainer}>
                    <LargeText size={24} marginBottom={10}>You've been invited to: {invite.name}!</LargeText>

                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Image source={invite.hasHostImage ? {uri: invite.hostImage}
                            : require("../../../assets/logo.png")} style={styles.profileImg}/>
                        <MediumText size={18}>{invite.hostName ? invite.hostName
                            : invite.hostFirstName + " " + invite.hostLastName}
                        </MediumText>
                    </View>
                    
                    <View style={styles.logistics}>
                        <View style={styles.row}>
                            <Ionicons name="location-sharp" size={20} />
                            <NormalText paddingHorizontal={10} color="black">
                                {invite.location}
                            </NormalText>
                            <Link onPress={() => openMap({ query: invite.location, provider: "google" })}>
                                (view on map)
                            </Link>
                        </View>

                        <View style={styles.row}>
                            <Ionicons name="calendar-outline" size={20} />
                            <NormalText paddingHorizontal={10} color="black">
                                {getDate(invite.date.toDate())}
                            </NormalText>
                        </View>

                        <View style={styles.row}>
                            <Ionicons name="time-outline" size={20} />
                            <NormalText paddingHorizontal={10} color="black">
                                {getTime(invite.date.toDate())}
                            </NormalText>
                        </View>
                    </View>

                    <View style = {styles.text}>
                        <NormalText>{invite.description}</NormalText>
                    </View>
                </View>

                <View style = {styles.buttonView}>
                    <Button onPress = {() => {
                        const inviteRef = db.collection("Private Events").doc(invite.inviteID)
                        inviteRef.get().then((doc) => {
                        let data = doc.data()
                        let currentAttendees = data.attendees
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
                                    ref.delete().then(r => {
                                        alert("Invite accepted! It will now appear under Your Events.")
                                        navigation.goBack();
                                    })
                                });
                            })


                        })
                    }} marginHorizontal={10}>
                        Accept
                    </Button>
                    <Button onPress = {() => {
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
                                    ref.delete().then(r => {
                                        alert("Invite declined. It will be removed from your list of invites.");
                                        navigation.goBack();
                                    })
                                })
                            });
                        })
                    }} backgroundColor="red" marginHorizontal={10}>
                        Decline
                    </Button>
                </View>
            </ScrollView>
        </Layout>
    );
}

const styles = StyleSheet.create({
    imageBackground: {
        width: Dimensions.get("screen").width,
        height: 150,
        marginBottom: 30,
    },

    option: {
        padding: 10
    },

    infoContainer: {
        paddingHorizontal: 30
    },

    text: {
        alignItems: "flex-start",
        flexDirection: "row",
        width: Dimensions.get('screen').width - 40,
        paddingVertical: 25
    },

    profileImg: {
        width: 30,
        height: 30,
        borderRadius: 15,
        borderColor: "#5DB075",
        borderWidth: 1,
        backgroundColor: "white",
        marginRight: 3
    },

    logistics: {
        marginVertical: 15,
    },

    row: {
        flexDirection: "row",
        marginVertical: 4,
    },

    buttonView: {
        flexDirection: "row",
        alignSelf: "center",
        marginVertical: 15
    }
});