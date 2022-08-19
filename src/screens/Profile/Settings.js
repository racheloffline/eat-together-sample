import React, { useState, useEffect } from "react";
import {
    View,
    StyleSheet,
    Image,
    Dimensions,
    TouchableOpacity,
    KeyboardAvoidingView,
    FlatList,
    Alert, Linking
} from 'react-native';
import { Layout, TopNav, TextInput } from "react-native-rapi-ui";
import { Ionicons, Feather } from '@expo/vector-icons';

import * as ImagePicker from 'expo-image-picker';
import { db, auth, storage } from "../../provider/Firebase";
import firebase from "firebase";
import "firebase/firestore"

import { cloneDeep } from "lodash";
import allTags from "../../allTags";

import TagsSection from "../../components/TagsSection";
import Button from "../../components/Button";
import MediumText from "../../components/MediumText";
import SmallText from "../../components/SmallText";
import DeviceToken from "../utils/DeviceToken";
import KeyboardAvoidingWrapper from "../../components/KeyboardAvoidingWrapper";

export default function ({ route, navigation }) {
    let user = auth.currentUser;
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
                        })
                    }
                },
                {
                    text: "No",
                    onPress: async () => {
                        await db.collection("Users").doc(user.uid).update({
                            "settings.notifications": false
                        })
                    }
                }
            ]
        );
    }

    async function signOut () {
        await db.collection("Users").doc(user.uid).update({
            pushTokens: firebase.firestore.FieldValue.arrayRemove(DeviceToken.getToken())
        })
        await firebase.auth().signOut()
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
                    onPress: () => {
                        user.delete().catch((error) => {
                            signOut().then(() => {
                                alert("You need to sign in again to proceed.");
                            })
                        })
                    },
                    style: "destructive"
                }
            ]
        );
    }

    const buttons = [
        {
            name: "Notification Preferences",
            icon: "notifications",
            func: () => changeNotifSettings()
        },
        {
            name: "Privacy Policy",
            icon: "hand-left",
            func: () => {Linking.openURL("https://www.eat-together.tech/privacy-policy")}
        },
        {
            name: "Report a Bug",
            icon: "bug",
            func: () => {navigation.navigate("Report Bug")}
        },
        {
            name: "Suggest an Idea",
            icon: "bulb",
            func: () => {navigation.navigate("Suggest Idea")}
        },
        {
            name: "Log Out",
            icon: "log-out",
            func: () => signOut()
        },
        {
            name: "Delete Account",
            icon: "trash",
            func: () => deleteAccount()
        }
    ]

    const renderButton = ({ item }) => (
        <TouchableOpacity onPress={item.func} style={styles.listItem}>
            <View style={styles.listView}>
                <Ionicons name = {item.icon} size = {25}/>
                <MediumText style={styles.text}>{item.name}</MediumText>
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
    listItem: {
        marginVertical: 5
    },
    listView: {
        flexDirection: "row",
        width: Dimensions.get("screen").width - 20
    },
    text: {
        marginHorizontal: 8
    }
});
