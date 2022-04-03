//Functionality TDB, most likely to be used to implement ice-breaker games

import React, {useState} from "react";
import {Button, Layout, Section, SectionImage, Text} from "react-native-rapi-ui";
import { TextInput } from 'react-native-rapi-ui';
import {View} from "react-native";
import {Ionicons} from "@expo/vector-icons";

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
            <View>
                <TextInput
                    placeholder="Title"
                    value={title}
                    onChangeText={(val) => setTitle(val)}
                    leftContent={
                        <Ionicons name="chatbubble-outline" size={20} />
                    }
                />
            </View>
            <View>
                <TextInput
                    placeholder="Description"
                    value={description}
                    onChangeText={(val) => setDescription(val)}
                    leftContent={
                        <Ionicons name="document-text-outline" size={20}/>
                    }
                />
            </View>
                <View>
                    <TextInput
                        placeholder="Date"
                        value={date}
                        onChangeText={(val) => setDate(val)}
                        leftContent={
                            <Ionicons name="calendar-outline" size={20}/>
                        }
                    />
                </View>
                <View>
                    <TextInput
                        placeholder="Time"
                        value={time}
                        onChangeText={(val) => setTime(val)}
                        leftContent={
                            <Ionicons name="time-outline" size={20}/>
                        }
                    />
                </View>
                <View>
                    <TextInput
                        placeholder="Location"
                        value={location}
                        onChangeText={(val) => setLocation(val)}
                        leftContent={
                            <Ionicons name="location-outline" size={20}/>
                        }
                    />
                </View>
                <Button text="Post" status="success" />
            </Section>
        </Layout>
    );
}