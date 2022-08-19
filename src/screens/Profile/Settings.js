import React, { useState, useEffect } from "react";
import {
    View,
    StyleSheet,
    Image,
    Dimensions,
    TouchableOpacity,
    KeyboardAvoidingView,
    FlatList,
    Alert
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
                            signOut()
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
            func: () => changeNotifSettings()
        },
        {
            name: "Log Out",
            func: () => signOut()
        },
        {
            name: "Delete Account",
            func: () => deleteAccount()
        }
    ]

    const renderButton = ({ item }) => (
        <TouchableOpacity onPress={item.func} style={styles.listItem}>
            <MediumText>{item.name}</MediumText>
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
            <FlatList data={buttons} renderItem={renderButton} style={styles.flatlist}/>
        </Layout>
    );
}
const styles = StyleSheet.create({
    flatlist: {
        marginVertical: 10
    },
    listItem: {
        marginVertical: 10
    }
});
