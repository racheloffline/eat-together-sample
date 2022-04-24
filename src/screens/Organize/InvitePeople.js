//Display upcoming events to join

import React, {useEffect, useState} from "react";
import {View, StyleSheet, FlatList, Dimensions, Button} from "react-native";

import EventCard from '../../components/EventCard';
import Header from "../../components/Header";

import {db} from "../../provider/Firebase";
import {TopNav} from "react-native-rapi-ui";
import {Ionicons} from "@expo/vector-icons";
import InvitePerson from "../../components/InvitePerson";

const generateColor = () => {
    const randomColor = Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, '0');
    return `#${randomColor}`;
};

export default function({ navigation }) {
    const [users, setUsers] = useState([]); // initial state, function used for updating initial state

    useEffect(() => { // updates stuff right after React makes changes to the DOM
        const ref = db.collection("Users");
        ref.onSnapshot((query) => {
            const list = [];
            query.forEach((doc) => {
                let data = doc.data();
                list.push({
                    id: doc.id,
                    name: data.name,
                    quote: data.quote,
                    profile: "https://e3.365dm.com/16/07/768x432/rtr3cltb-1_3679323.jpg?20160706114211"
                });
            });
            setUsers(list);
        });
    }, []);

    return (
        <View style={{flex:1}}>
            <TopNav
                middleContent="Suggested People"
                leftContent={
                    <Ionicons
                        name="chevron-back"
                        size={20}
                    />
                }
                leftAction={() => navigation.goBack()}
            />
            <FlatList contentContainerStyle={styles.invites} keyExtractor={item => item.id}
                      data={users} renderItem={({item}) =>
                <InvitePerson person={item} color={generateColor()}/>
            }/>
            <Button title="Send Invites" style={styles.submit} color="#5db075"/>
        </View>
    );
}

const styles = StyleSheet.create({
    invites: {
        alignItems: "center",
        padding: 30
    },
    submit: {
        position: 'absolute',
        bottom:0,
    }
});