import React from 'react';
import {View, StyleSheet, Image, Dimensions, TouchableOpacity} from "react-native";
import {Layout, Text, TopNav} from "react-native-rapi-ui";
import {Ionicons} from "@expo/vector-icons";
import MediumText from "../../components/MediumText";
import NormalText from "../../components/NormalText";
import firebase from "firebase";
import {db} from "../../provider/Firebase";

export default function ({ route, navigation}) {
    //Save the invite as a shorter name
    let invite = route.params.invite;

    //Get the current user and firebase ref path
    const user = firebase.auth().currentUser;
    //const ref = db.collection("User Invites").doc(route.params.invite.ref).collection("Invites").doc(route.params.invite.id);
    const ref = db.collection("User Invites").doc(user.uid).collection("Invites").doc(invite.id);

    // function displayImage(image) {
    //     if(image == null || image === "") {
    //         return "https://static.onecms.io/wp-content/uploads/sites/9/2020/04/24/ppp-why-wont-anyone-rescue-restaurants-FT-BLOG0420.jpg"
    //     } else {
    //         return image
    //     }
    // }

    //Check to see if the invite has an image. If not, display a stock image
    function displayImage() {
        if(!invite.hasImage) {
            return "https://static.onecms.io/wp-content/uploads/sites/9/2020/04/24/ppp-why-wont-anyone-rescue-restaurants-FT-BLOG0420.jpg"
        } else {
            return invite.image
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
            <View style={styles.page}>
                <View style={styles.background}/>
                <Image style={styles.image}
                       source={{uri: displayImage()}}/>
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
                {/*<View style = {styles.icons}>*/}
                {/*    <Ionicons name="time-outline" size={24}/>*/}
                {/*    <Text>  </Text>*/}
                {/*    <NormalText size = {20}>{invite.time}</NormalText>*/}
                {/*</View>*/}
                <View style = {styles.text}>
                    <NormalText size = {20}>Details: {invite.details}</NormalText>
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
                                        alert("Invite Accepted!");
                                        navigation.goBack();
                                    })
                                } else {
                                    alert("Invite already accepted.");
                                }

                            })
                        })
                    }}>
                        <NormalText size = {18} color = {"green"}>Accept Invite</NormalText>
                    </TouchableOpacity>
                    <TouchableOpacity style = {{paddingVertical: 10}}onPress = {() => {
                        ref.set({
                            accepted: "declined"
                        }, {merge: true}).then(() => {
                            alert("Invite Declined");
                            navigation.goBack();
                        })
                    }}>
                        <NormalText size = {18} color = {"red"}>Decline Invite</NormalText>
                    </TouchableOpacity>
                </View>



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