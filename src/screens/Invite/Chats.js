import React from 'react';
import {View, StyleSheet} from 'react-native'
import {Layout} from "react-native-rapi-ui";
import HorizontalSwitch from "../../components/HorizontalSwitch";
import NormalText from "../../components/NormalText";

export default function ({ route, navigation }) {
    return(
        <Layout>
            {/*<View style = {styles.switchView}>*/}
            {/*    <HorizontalSwitch left="Invites" right="Chats" current="right" press={(val) => navigation.navigate("Invite")}/>*/}
            {/*</View>*/}
            {/*<View style = {styles.comingSoonView}>*/}
            {/*    <NormalText center={"center"}>Chats are coming soon!</NormalText>*/}
            {/*</View>*/}
        </Layout>
    );
}
//
// const styles = StyleSheet.create({
//     switchView: {
//         marginVertical: 25
//     },
//     comingSoonView: {
//         marginVertical: -15,
//     }
// });