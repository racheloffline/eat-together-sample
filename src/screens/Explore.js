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
    useEffect(()=> { // updates stuff right after React makes changes to the DOM
        const ref = db.collection("Public Events");
        ref.onSnapshot((query) => {
            const list = [];
            query.forEach((doc) => {
                list.push(doc.data());
            });
            setEvents(list);
        });
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
