import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { Layout, TopNav } from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";
import { db } from "../../provider/Firebase";
import MediumText from "../../components/MediumText";
import PeopleList from "../../components/PeopleList";
import {generateColor} from "../../methods";

export default function ({route, navigation}) {
    let group = route.params.group;
    const [users, setUsers] = useState([]);

    useEffect(() => {
        db.collection("Groups").doc(group.groupID).onSnapshot((doc) => {
            let userIDs;
            let userList = [];
            userIDs = doc.data().uids;
            userIDs.forEach((uid) => {
                db.collection("Users").doc(uid).get().then((doc) => {
                    userList.push(doc.data());
                }).then(() => {
                    setUsers(userList);
                });
            })
        })
    }, [])
    return(
        <Layout>
            <TopNav
                middleContent={<MediumText>View Group Details</MediumText>}
                leftContent={<Ionicons name="chevron-back" size={20} />}
                leftAction={() => {
                    navigation.goBack();
                }}
            />
            <View style = {styles.list}>
                <FlatList contentContainerStyle={styles.invites} keyExtractor={item => item.id}
                          data={users} renderItem={({item}) =>
                    <PeopleList person={item} color={generateColor()} click={() => {
                        navigation.navigate("FullProfile", {
                            person: item
                        });
                    }}/>
                }/>
            </View>
        </Layout>
    )
}

const styles = StyleSheet.create({
    invites: {
        alignItems: "center",
        padding: 30
    },
    list: {
        marginVertical: -20
    }
})