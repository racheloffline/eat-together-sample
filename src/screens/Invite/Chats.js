//Chat with users you have already connected with

import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Layout, TopNav} from 'react-native-rapi-ui';
import NormalText from "../../components/NormalText";
import {Ionicons} from "@expo/vector-icons";
import HorizontalSwitch from "../../components/HorizontalSwitch";
import MediumText from "../../components/MediumText";

export default function ({ navigation }) {

    return (
        <Layout>
            <TopNav
                middleContent={
                    <MediumText center>Notifications</MediumText>
                }
                leftContent={
                    <Ionicons
                        name="chevron-back"
                        size={20}
                    />
                }
                rightContent={
                    <Ionicons
                        name="person-add"
                        size={20}
                    />
                }
                leftAction={() => navigation.goBack()}
                rightAction={() => navigation.navigate("Connections")}
            />
            <View style = {styles.switchView}>
                <HorizontalSwitch left="Invites" right="Chats" current="right" press={(val) => navigation.navigate("Invite")}/>
            </View>
            <View style = {styles.comingSoon}>
                <NormalText center={"center"}>Coming soon!</NormalText>
            </View>

        </Layout>

    );
}

const styles = StyleSheet.create({
    header:	{
        padding: 40,
        display: "flex",
        marginBottom: -20
    },
    headingText: {
        fontSize: 50
    },
    switchView: {
        marginVertical: 10
    },
    comingSoon: {
        marginVertical: -20,
    }
});
