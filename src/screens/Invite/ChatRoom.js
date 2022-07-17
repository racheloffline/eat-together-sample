import React, {useCallback, useEffect, useState} from 'react';
import {View, StyleSheet, Image, Dimensions, TouchableOpacity, ScrollView} from "react-native";
import {Layout, Text, TopNav} from "react-native-rapi-ui";
import {Ionicons} from "@expo/vector-icons";
import MediumText from "../../components/MediumText";
import NormalText from "../../components/NormalText";
import firebase from "firebase";
import {db, storage} from "../../provider/Firebase";
import {GiftedChat} from "react-native-gifted-chat";

export default function ({ route, navigation}) {
    //Save the invite as a shorter name
    const [image, setImage] = useState("https://images.immediate.co.uk/production/volatile/sites/30/2017/01/Bananas-218094b-scaled.jpg");
    const [messages, setMessages] = useState([{
        _id: 1,
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
            _id: 2,
            name: 'React Native',
        },
    }]);
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
    }, []);

    const onSend = useCallback((messages = []) => {
        setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
    }, [])

    return (
        <Layout>
            <TopNav
                middleContent={invite.name}
                leftContent={
                    <Ionicons
                        name="chevron-back"
                        size={20}
                    />
                }
                rightContent={
                    <Image style={styles.image} source={{uri: image}}/>
                }
                leftAction={() => navigation.goBack()}
            />
            <GiftedChat
                messages={messages}
                onSend={messages => onSend(messages)}
                user={{
                    _id: 1,
                }}
            />
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
        width: 40,
        height: 40,
        borderRadius: 90,
        borderColor: "white",
        borderWidth: 2,
    },

});