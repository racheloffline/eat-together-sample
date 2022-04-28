import React from 'react';
import {View, StyleSheet, Image, Dimensions} from "react-native";
import {Layout, Text, TopNav} from "react-native-rapi-ui";
import {Ionicons} from "@expo/vector-icons";
import Tag from "../../components/Tag";
import NormalText from "../../components/NormalText";

export default function ({ navigation, invite}) {
    console.log(invite)
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
                       source={{uri: invite.image}}/>
                <NormalText style={styles.text}>{invite.host.name} is inviting you to an event!</NormalText>
                <NormalText style={styles.text}>Location: {invite.location}</NormalText>
                <Text style={styles.text}>Date: {invite.date}</Text>
                <Text style={styles.text}>Time: {invite.time}</Text>
                <Text style={styles.text}>Details: {invite.location}</Text>
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