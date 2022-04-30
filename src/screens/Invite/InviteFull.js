import React from 'react';
import {View, StyleSheet, Image, Dimensions, TouchableOpacity} from "react-native";
import {Layout, Text, TopNav} from "react-native-rapi-ui";
import {Ionicons} from "@expo/vector-icons";
import MediumText from "../../components/MediumText";
import NormalText from "../../components/NormalText";
import firebase from "firebase";
import {db} from "../../provider/Firebase";

export default function ({ route, navigation}) {
    //Get the current user and firebase ref path
    const user = firebase.auth().currentUser;
    const ref = db.collection("User Invites").doc(user.email).collection("Invites").doc(route.params.invite.id);

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
            <View style={styles.page}>
                <View style={styles.background}/>
                <Image style={styles.image}
                       source={{uri: route.params.invite.image}}/>
                <MediumText style={styles.text}>{route.params.invite.hostID} is inviting you to an event!</MediumText>
                <MediumText style={styles.text}>Event name: {route.params.invite.name}</MediumText>
                <MediumText style={styles.text}>Location: {route.params.invite.location}</MediumText>
                <MediumText style={styles.text}>Date: {route.params.invite.date}</MediumText>
                <MediumText style={styles.text}>Time: {route.params.invite.time}</MediumText>
                <MediumText style={styles.text}>Details: {route.params.invite.details}</MediumText>
                <TouchableOpacity onPress = {() => {
                    ref.set({
                        accepted: "accepted"
                    }, {merge: true}).then(() => {
                        alert("Invite Accepted!");
                        navigation.goBack();
                    })
                }}>
                    <NormalText>Accept Invite</NormalText>
                </TouchableOpacity>
                <TouchableOpacity onPress = {() => {
                    ref.set({
                        accepted: "declined"
                    }, {merge: true}).then(() => {
                        alert("Invite Declined");
                        navigation.goBack();
                    })
                }}>
                    <NormalText>Decline Invite</NormalText>
                </TouchableOpacity>
            </View>
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
        width: 100,
        height: 100,
        borderColor: "white",
        borderWidth: 3,
        borderRadius: 50
    },

    text: {
        marginVertical: 20,
        fontSize: 24
    }

});