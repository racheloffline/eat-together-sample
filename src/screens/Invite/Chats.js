//Chat with users you have already connected with

import React, {useEffect, useState} from 'react';
import {View, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import {Button, Layout, TopNav} from 'react-native-rapi-ui';
import NormalText from "../../components/NormalText";
import {Ionicons} from "@expo/vector-icons";
import HorizontalSwitch from "../../components/HorizontalSwitch";
import MediumText from "../../components/MediumText";
import Searchbar from "../../components/Searchbar";
import PeopleList from "../../components/PeopleList";
import {generateColor} from "../../methods";
import SelectSearch from 'react-select-search';
import {db} from "../../provider/Firebase";
import firebase from "firebase";
import ChatPreview from "../../components/ChatPreview";

export default function ({ navigation }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [users, setUsers] = useState([]);
    const [hasInput, setHasInput] = useState(false);
    const onChangeText = (text) => {
        setSearchQuery(text);
    }
    useEffect(() => {
        const user = firebase.auth().currentUser;
        const ref = db.collection("Users").doc(user.uid);
        ref.onSnapshot((doc) => {
            const friends = doc.data().friendIDs;
            let list = [];
            friends.forEach((uid) => {
                db.collection("Users").doc(uid).get().then((doc) => {
                    let data = doc.data()
                    list.push({
                        id: data.id,
                        username: data.username,
                        name: data.name,
                        hasImage: data.hasImage,
                        message: "TODO",
                        time: "8m ago",
                        pictureID: data.id
                    })
                }).then(() => {
                    setUsers(list);
                });
            });
        });
    }, []);
    // Code for searchbar suggestions (your taste buds)

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
            <View style = {styles.content}>
                <View style={styles.searchArea}>
                    <Searchbar placeholder="Search by name"
                           value={searchQuery} onChangeText={onChangeText} width={320}/>
                    <Button text="Chat" disabled={!hasInput} color="black"></Button>
                </View>
                <FlatList contentContainerStyle={styles.invites} keyExtractor={item => item.id}
                          data={users} renderItem={({item}) =>
                    <TouchableOpacity onPress={() => {
                    navigation.navigate("ChatRoom", {
                    invite: item
                })
                }}>
                    <ChatPreview group={item} click={() => {
                        db.collection("Users").doc(item.id).get().then((doc) => {
                            navigation.navigate("FullProfile", {
                                person: doc.data()
                            });
                        });
                    }}/>
                    </TouchableOpacity>
                }/>
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
    content: {
        marginVertical: -20,
    },
    searchArea: {
        flexDirection: "row",
        justifyContent: "space-evenly"
    }
});
