//Display potential friends to share meals with

import React, {useEffect, useState} from "react";
import {View} from "react-native";
import {db} from "../navigation/AppNavigator";
import {
  Layout,
  Text,
  useTheme,
} from "react-native-rapi-ui";


export default function ({ navigation }) {
    const [events, setEvents] = useState([]); // initial state, function used for updating initial state
    const getEvents = async () => {
        try {
            let list = [];
            let snapshot = await db.collection("Public Events").get();
            snapshot.forEach((doc)=> {
                list.push(doc.data());
            })
            setEvents(list);
        } catch (e) {
            alert(e);
        }
    };

    useEffect(()=> {
        getEvents(); // updates stuff right after React makes changes to the DOM
    }, []);
  return (
    <Layout>
    <View
        style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            marginHorizontal: 50
        }}
    >
        {events.map((event) => (
            <Text>{event.title}</Text>
        ))}
    </View>
    </Layout>
  );
}
