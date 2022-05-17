import React, {useState} from "react";
import {Button, Layout, Section, SectionImage, Text, TopNav} from "react-native-rapi-ui";
import { TextInput } from 'react-native-rapi-ui';
import {Ionicons} from "@expo/vector-icons";
import {db} from "../../provider/Firebase";
import firebase from "firebase";
import { getDatabase, ref, set } from "firebase/database";

export default function ({ navigation }) {
    const [name, setName] = React.useState('');
    const [username, setUsername] = React.useState('');
    const [quote, setQuote] = React.useState('');
    const user = firebase.auth().currentUser;
    return (
        <Layout>
        <TopNav
            middleContent="Settings"
            leftContent={
            <Ionicons
                name="chevron-back"
                size={20}
            />
           }
           leftAction={() => navigation.goBack()}
           />
            <Section>
                <TextInput
                    placeholder="Name"
                    value={name}
                    onChangeText={(val) => setName(val)}
                    leftContent={
                        <Ionicons name="person-circle-outline" size={20} />
                    }
                />
                <TextInput
                    placeholder="Quote"
                    value={quote}
                    onChangeText={(val) => setQuote(val)}
                    leftContent={
                    <Ionicons name="chatbox-ellipses-outline" size={20}/>
                    }
                />

                <Button text="Update" status="success" onPress={function () {
                    db.collection("Users").doc(user.uid).set({
                        name: name,
                        quote: quote
                    }).then(r => {
                        alert("Profile Updated");
                    })
                }}/>

                <Button text="Log Out"
                   onPress={() => {
                        firebase.auth().signOut();
                   }}
                />
            </Section>
        </Layout>
    );
}

