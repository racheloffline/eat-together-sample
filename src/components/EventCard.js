import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Dimensions, TouchableOpacity } from 'react-native';
import { Section, SectionContent, SectionImage } from 'react-native-rapi-ui';
import MediumText from './MediumText';
import SmallText from './SmallText';

import getDate from "../getDate";
import getTime from "../getTime";
import { db, storage } from '../provider/Firebase';

const EventCard = props => {
    // Stores image URLs
    const [hostImage, setHostImage] = useState("");
    const [image, setImage] = useState("");

    useEffect(() => {
        db.collection("Users").doc(props.event.hostID).get().then(doc => {
            if (doc.data().hasImage) {
                storage.ref("profilePictures/" + props.event.hostID).getDownloadURL().then(uri => {
                    setHostImage(uri);
                });
            }
        });
    }, []);
    
    return (
        <Section style={styles.card} borderRadius={30}>
            <TouchableOpacity onPress={props.click} disabled={props.disabled}>
                <SectionImage source={props.event.hasImage ? {uri: props.event.image}
                    : {uri: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?crop=entropy&cs=tinysrgb&fm=jpg&ixlib=rb-1.2.1&q=60&raw_url=true&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8Zm9vZHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=1400"}}/>

                <SectionContent>
                    <View style={styles.details}>
                        <Image style={styles.profile} source={hostImage ? {uri: hostImage}
                            : require("../../assets/logo.png")}/>
                            
                        <View style={styles.text}>
                            <MediumText>{props.event.name}</MediumText>
                            <SmallText size={12}>
                                {props.event.location} | {getDate(props.event.date.toDate())} | {getTime(props.event.date.toDate())}
                            </SmallText>
                        </View>
                    </View>
                </SectionContent>
            </TouchableOpacity>
        </Section>
    );
}

const styles = StyleSheet.create({
    card: {
        shadowColor: "#000000",
        shadowOpacity: 0.25,
        shadowOffset: {
            width: 0,
            height: 4
        },
        elevation: 20,
        width: Dimensions.get('window').width - 50,
        marginBottom: 10,
    },

    image: {
        width: Dimensions.get('window').width - 50,
        height: 150,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
    },

    details: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center"
    },

    profile: {
        backgroundColor: "#5DB075",
        borderWidth: 2,
        borderColor: "#5DB075",
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 10
    },

    text: {
        flexDirection: "column",
        maxWidth: Dimensions.get('window').width - 150
    }
})

export default EventCard;