//Chat with users you have already connected with

import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {Layout, TopNav} from 'react-native-rapi-ui';
import NormalText from "../../components/NormalText";
import {Ionicons} from "@expo/vector-icons";
import HorizontalSwitch from "../../components/HorizontalSwitch";
import MediumText from "../../components/MediumText";
import Searchbar from "../../components/Searchbar";

export default function ({ navigation }) {
    const [searchQuery, setSearchQuery] = useState("");
    const onChangeText = (text) => {
        setSearchQuery(text);
    }

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
                <HorizontalSwitch left="Invites" right="Chats" current="right" press={() => navigation.navigate("Invite")}/>
            </View>
            <View style = {styles.comingSoon}>
                <Searchbar placeholder="Search by name, date, location, or additional info"
                           value={searchQuery} onChangeText={onChangeText}/>
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
