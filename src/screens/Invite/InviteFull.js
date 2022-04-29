import React from 'react';
import {View, StyleSheet, Image, Dimensions} from "react-native";
import {Layout, Text, TopNav} from "react-native-rapi-ui";
import {Ionicons} from "@expo/vector-icons";
import Tag from "../../components/Tag";
import NormalText from "../../components/NormalText";
import MediumText from "../../components/MediumText";

export default function ({ route, navigation}) {
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