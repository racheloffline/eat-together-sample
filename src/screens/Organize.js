//Functionality TDB, most likely to be used to implement ice-breaker games

import React, {useState} from "react";
import {Button, Layout, Section, SectionImage, Text} from "react-native-rapi-ui";
import { TextInput } from 'react-native-rapi-ui';
import {Ionicons} from "@expo/vector-icons";
import {db} from "../navigation/AppNavigator";

export default function ({ navigation }) {
    const [title, setTitle] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [date, setDate] = React.useState('');
    const [time, setTime] = React.useState('');
    const [location, setLocation] = React.useState('');
    return (
        <Layout>
            <Section>
                <SectionImage source={require('../../assets/food.jpg')} />
                <TextInput
                    placeholder="Title"
                    value={title}
                    onChangeText={(val) => setTitle(val)}
                    leftContent={
                        <Ionicons name="chatbubble-outline" size={20} />
                    }
                />
                <TextInput
                    placeholder="Location"
                    value={location}
                    onChangeText={(val) => setLocation(val)}
                    leftContent={
                    <Ionicons name="location-outline" size={20}/>
                    }
                />
                    <TextInput
                        placeholder="Date"
                        value={date}
                        onChangeText={(val) => setDate(val)}
                        leftContent={
                            <Ionicons name="calendar-outline" size={20}/>
                        }
                    />
                    <TextInput
                        placeholder="Time"
                        value={time}
                        onChangeText={(val) => setTime(val)}
                        leftContent={
                            <Ionicons name="time-outline" size={20}/>
                        }
                    />
                <TextInput
                    placeholder="Description"
                    value={description}
                    onChangeText={(val) => setDescription(val)}
                    containerStyle={{padding:40}}
                    leftContent={
                    <Ionicons name="document-text-outline" size={20}/>
                    }
                />
                <Button text="Post" status="success" onPress={function () {
                    db.collection("Public Events").add({
                        title: title,
                        location: location,
                        date: date,
                        time: time,
                        description: description
                    }).then(r => {
                        alert("POST SUCCESSFUL");
                        navigation.navigate('ExploreMain')
                    })
                }}/>
            </Section>
        </Layout>
    );
}