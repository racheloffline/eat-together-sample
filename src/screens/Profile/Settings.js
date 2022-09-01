import React, { useState, useEffect } from "react";
import {
    View,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    FlatList,
    Alert, Linking
} from 'react-native';
import { Layout, TopNav } from "react-native-rapi-ui";
import { Ionicons } from '@expo/vector-icons';

import { db, auth } from "../../provider/Firebase";
import firebase from "firebase";
import "firebase/firestore"

import MediumText from "../../components/MediumText";
import DeviceToken from "../utils/DeviceToken";

export default function ({ navigation }) {
    const user = auth.currentUser;
    const [userInfo, setUserInfo] = useState({});
    let [notifs, setNotifs] = useState(false);
    let [logoutDisabled, setLogoutDisabled] = useState(false); // Prevent the user from logging out "more than once"

    // Fetch current user info
    useEffect(() => {
        if (user) {
            db.collection("Users").doc(user.uid).get().then(doc => {
                setUserInfo(doc.data());
                setNotifs(doc.data().settings.notifications);
            });
        }
    });

    function changeNotifSettings() {
        Alert.alert(
            "Update Notification Settings",
            "Would you like to receive push notifications from Eat Together?",
            [
                {
                    text: "Yes",
                    onPress: async () => {
                        await db.collection("Users").doc(user.uid).update({
                            "settings.notifications": true
                        });
                        
                        setNotifs(true);
                        alert("Notification preference updated :)");
                    }
                },
                {
                    text: "No",
                    onPress: async () => {
                        await db.collection("Users").doc(user.uid).update({
                            "settings.notifications": false
                        });

                        setNotifs(false);
                        alert("Notification preference updated :)");
                    }
                }
            ]
        );
    }

    async function signOut () {
        if (!logoutDisabled) {
            setLogoutDisabled(true);
            await db.collection("Users").doc(user.uid).update({
                pushTokens: firebase.firestore.FieldValue.arrayRemove(DeviceToken.getToken())
            });

            await firebase.auth().signOut();
        }
    }

    function deleteAccount () {
        Alert.alert(
            "Are you sure?",
            "Deleting your account cannot be reversed. Are you sure you want to continue?",
            [
                {
                    text: "No",
                    onPress: () => {},
                    style: "cancel"
                },
                {
                    text: "Yes",
                    onPress: async () => {
                        const uid = user.uid;

                        await user.delete().then(() => {
                            alert("Account deleted successfully. Sorry to see you go :(");
                            db.collection("Users").doc(uid).delete();
                            db.collection("Usernames").doc(userInfo.username).delete();
                        }).catch((error) => {
                            signOut().then(() => {
                                alert("You need to sign in again to proceed.");
                            });
                        });
                    },
                    style: "destructive"
                }
            ]
        );
    }

    const buttons = [
        {
            name: " Notification Preferences" + (notifs ? " (ON)" : " (OFF)"),
            icon: "notifications",
            func: () => changeNotifSettings()
        },
        {
            name: " Privacy Policy",
            icon: "hand-left",
            func: () => {Linking.openURL("https://www.eat-together.tech/privacy-policy")}
        },
        {
            name: " Report a Bug",
            icon: "bug",
            func: () => {navigation.navigate("Report Bug")}
        },
        {
            name: " Suggest an Idea",
            icon: "bulb",
            func: () => {navigation.navigate("Suggest Idea")}
        },
        {
            name: " Log Out",
            icon: "log-out",
            func: () => signOut()
        },
        {
            name: " Delete Account",
            icon: "trash",
            func: () => deleteAccount()
        }
    ]

    const renderButton = ({ item }) => (
        <TouchableOpacity onPress={item.func}>
            <View style={styles.listView}>
                <Ionicons name = {item.icon} size = {25}
                    color={item.name.toLowerCase().includes("delete") ? "red" : "black"}/>
                <MediumText color={item.name.toLowerCase().includes("delete") ? "red" : "black"}>
                        {item.name}
                </MediumText>
            </View>
        </TouchableOpacity>
    )
    return(
        <Layout>
            <TopNav
                middleContent={
                    <MediumText center>Settings</MediumText>
                }
                leftContent={
                    <Ionicons
                        name="chevron-back"
                        size={20}
                    />
                }
                leftAction={() => navigation.goBack()}
            />
            <FlatList data={buttons} renderItem={renderButton} style={styles.flatlist} scrollEnabled={false}/>
        </Layout>
    );
}
const styles = StyleSheet.create({
    flatlist: {
        marginVertical: 10,
        marginHorizontal: 10
    },
    listView: {
        flexDirection: "row",
        paddingVertical: 15
    }
});
