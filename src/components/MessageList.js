import React from 'react';
import { View, StyleSheet, Image} from 'react-native';
import {CheckBox} from 'react-native-rapi-ui';
import LargeText from "./LargeText";
import MediumText from "./MediumText";
import {Ionicons} from "@expo/vector-icons";
import {TouchableOpacity} from "react-native";
import firebase from "firebase";
import {db} from "../provider/Firebase";

const MessageList = props => {
    const [checkBox, setCheckbox] = React.useState(false);
    return (
        <View style={styles.outline}>
            <View style={styles.head}>
                <TouchableOpacity onPress={props.click}>
                    <View style={styles.headleft}>
                        <Image style={styles.image} source={{uri: props.person.profile}}/>
                        <MediumText>{props.person.name}</MediumText>
                    </View>
                </TouchableOpacity>
                <View style={styles.response}>
                    <TouchableOpacity onPress={() => {
                        const user = firebase.auth().currentUser;
                        let requestedUser = db.collection("Usernames").doc(props.person.username);
                        requestedUser.get().then((doc) => {
                            db.collection("User Invites").doc(user.uid).collection("Connections").doc(doc.data().id).delete().then(() => {
                                alert("Request Declined");
                            });
                        });
                    }}>
                        <Ionicons name={"close-circle-outline"} color={"white"} size={40}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
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
                                        alert("Taste Bud Added");
                                    });
                                })
                            })
                        })
                    }}>
                        <Ionicons name={"checkmark-circle-outline"} color={"white"} size={40}/>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    outline: {
        padding: 10
    },
    head: {
        width: 370,
        height: 80,
        backgroundColor: "grey",
        borderRadius: 15,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    headleft: {
        flexDirection: "row",
        alignItems: "center"
    },
    image: {
        width: 60,
        height: 60,
        borderRadius: 90,
        borderColor: "white",
        borderWidth: 2,
        marginLeft: 25,
        marginRight: 20
    },
    name: {
        marginRight: 20,
    },
    response: {
        marginRight: 25,
        flexDirection: "row"
    }
})

export default MessageList;