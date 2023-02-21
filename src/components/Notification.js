import React from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Image
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import CustomButton from "./CustomButton";
import NormalText from "./NormalText";
import SmallText from "./SmallText";
import MediumText from "./MediumText";

import firebase from "firebase/compat";
import {auth, db} from "../provider/Firebase";

function whichIcon(type) {
    switch (type) {
        case "invite":
        default:
            return "mail-outline";
        case "private event":
        case "public event":
            return "fast-food-outline";
        case "user profile":
            return "person-add-outline";
    }
}

const Notification = (props) => {
    return (
        <View style={styles.outline}>
            <View style={styles.head}>
                <Ionicons name={whichIcon(props.notif.type)} size={50} style={styles.icon} color="black" />
                <View style={styles.textContainer}>
                    <MediumText marginBottom={15} size={14}>{props.notif.title}</MediumText>
                    {props.showButton && <View style={styles.buttons}>
                        {props.notif.type == "user profile" ?
                            <View style={styles.response}>
                                <CustomButton marginHorizontal={10} width={80} backgroundColor={"#D76161"} onPress={() => {
                                    db.collection("User Invites").doc(user.uid).collection("Connections").doc(props.person.id).delete().then(() => {
                                        alert("Request Declined");
                                    }).catch(() => {
                                        alert("Couldn't delete request, try again later.");
                                    });
                                }}>
                                    <SmallText center color="white">Decline</SmallText>
                                </CustomButton>
                                <CustomButton marginHorizontal={10} width={80} backgroundColor={"#5DB075"} onPress={() => {
                                    const user = firebase.auth().currentUser;
                                    db.collection("Usernames").doc(props.person.username).get().then((doc) => {
                                        // STEP 1: Add friend to current user's data
                                        db.collection("Users").doc(user.uid).update({
                                            friendIDs: firebase.firestore.FieldValue.arrayUnion(doc.data().id)
                                        }).then(() => {
                                            // STEP 2: Add current user as friend to other user's data
                                            db.collection("Users").doc(doc.data().id).update({
                                                friendIDs: firebase.firestore.FieldValue.arrayUnion(user.uid)
                                            }).then(() => {
                                                // STEP 3: Delete invite
                                                db.collection("User Invites").doc(user.uid).collection("Connections").doc(doc.data().id).delete().then(() => {
                                                    props.delete(props.person.id);
                                                    alert("Taste Bud Added");
                                                });
                                            })
                                        })
                                    }).catch(() => {
                                        alert("This user seems to no longer exist :(");
                                    })
                                }}>
                                    <SmallText center color="white">Accept</SmallText>
                                </CustomButton>
                            </View>
                            :  <CustomButton marginHorizontal={10} width={80} onPress={props.onPress} backgroundColor={"#BDBDBD"}>
                                    <SmallText center color="white">Details</SmallText>
                               </CustomButton>}
                    </View>}
                </View>
            </View>
        </View>
    );
};
    
const styles = StyleSheet.create({
    outline: {
        alignItems: "center",
        borderBottomWidth: 1.04,
        borderBottomColor: "#CACACA"
    },
    head: {
        width: Dimensions.get('window').width * 0.95,
        backgroundColor: "white",
        borderRadius: 15,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 30,
        paddingVertical: 10
    },
    textContainer: {
        flexDirection: "column",
        width: 250
    },
    icon: {
        width: 50,
        height: 50,
        marginRight: 20
    },
    buttons: {
        flexDirection: "row",
        justifyContent: "flex-end"
    },
    response: {

        flexDirection: "row"
    },
});

export default Notification;
