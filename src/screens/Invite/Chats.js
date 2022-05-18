import React from 'react';
import {Layout} from "react-native-rapi-ui";
import HorizontalSwitch from "../../components/HorizontalSwitch";

export default function ({ route, navigation }) {
    return(
        <Layout>
            <HorizontalSwitch left="Invites" right="Chats" current="right" press={(val) => navigation.navigate("Invite")}/>
        </Layout>
    );
}