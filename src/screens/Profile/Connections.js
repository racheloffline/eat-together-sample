//Look at your connections and connection requests

import React, {useEffect, useState} from 'react';
import {Layout, Text, TopNav} from 'react-native-rapi-ui';
import {Ionicons} from "@expo/vector-icons";
import HorizontalSwitch from "../../components/HorizontalSwitch";
import {db} from "../../provider/Firebase";
import {FlatList, StyleSheet} from "react-native";
import PeopleList from "../../components/PeopleList";
import {generateColor} from "../../methods";

export default function ({ navigation }) {
    const [users, setUsers] = useState([]); // initial state, function used for updating initial state

    useEffect(() => { // updates stuff right after React makes changes to the DOM
        const ref = db.collection("Users");
        ref.onSnapshot((query) => {
            const list = [];
            query.forEach((doc) => {
                let data = doc.data();
                list.push({
                    id: doc.id,
                    username: data.username,
                    name: data.name,
                    profile: "https://e3.365dm.com/16/07/768x432/rtr3cltb-1_3679323.jpg?20160706114211",
                });
            });
            setUsers(list);
        });
    }, []);

    return (
        <Layout>
            <TopNav
                middleContent="Connections"
                leftContent={
                    <Ionicons
                        name="chevron-back"
                        size={20}
                    />
                }
                leftAction={() => navigation.navigate("Explore")}
            />
            <HorizontalSwitch left="Connections" right="Requests" current="left" press={(val) => navigation.navigate("Requests")}/>
            <FlatList contentContainerStyle={styles.invites} keyExtractor={item => item.id}
                      data={users} renderItem={({item}) =>
                <PeopleList person={item} color={generateColor()} click={() => {
                    navigation.navigate("FullProfile", {
                        person: {
                            id: item.id,
                            username: item.username,
                            name: item.name,
                            image: item.profile,
                            quote: "There is no sunrise so beautiful that it is worth waking me up to see it.",
                            tags: [
                                "Not here to date",
                                "Brawl Stars",
                                "Rock music",
                                "Lover of Mexican food",
                                "Memes",
                                "Extroverted",
                                "Outgoing"
                            ]
                        }
                    });
                }}/>
            }/>
        </Layout>

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
