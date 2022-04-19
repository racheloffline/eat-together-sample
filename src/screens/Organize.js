import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Dimensions } from "react-native";
import { Button, Layout, Section, SectionImage  } from "react-native-rapi-ui";
import { TextInput } from 'react-native-rapi-ui';
import { Ionicons } from "@expo/vector-icons";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {db} from "../provider/Firebase";

import Header from "../components/Header";
import getDate from "../getDate";
import getTime from "../getTime";
import NormalText from "../components/NormalText";

export default function ({ navigation }) {
    // State variables for the inputs
    const [title, setTitle] = useState("");    
    const [location, setLocation] = useState("");
    const [date, setDate] = useState(new Date());
    const [description, setDescription] = useState("");

    // Other variables
    const [showDate, setShowDate] = useState(false);
    const [mode, setMode] = useState("date");
    const [disabled, setDisabled] = useState(true);

    // Checks whether we should disable the Post button or not
    useEffect(() => {
        if (title === "" || location == "") {
            setDisabled(true);
        } else {
            setDisabled(false);
        }
    }, [title, location]);

    // For selecting a date and time
    const changeDate = (selectedDate) => {
        const currentDate = selectedDate || date;
        setDate(currentDate); // Set the date
        setShowDate(false); // Exit the date/time picker modal
    }

    return (
        <Layout>
            <Section>
                <Header name="Organize"/>
                <SectionImage source={require('../../assets/food.jpg')} />
                <TextInput
                    placeholder="Title"
                    value={title}
                    onChangeText={(val) => {
                        setTitle(val);
                    }}
                    leftContent={
                        <Ionicons name="chatbubble-outline" size={20} />
                    }
                />
                <TextInput
                    placeholder="Location"
                    value={location}
                    onChangeText={(val) => {
                        setLocation(val);
                    }}
                    leftContent={
                        <Ionicons name="location-outline" size={20}/>
                    }
                />
                
                <View style={{display: "flex", flexDirection: "row"}}>
                    <TouchableOpacity onPress={() => {
                        setShowDate(true);
                        setMode("date");
                    }}>
                        <TextInput
                            value={getDate(date)}
                            leftContent={
                                <Ionicons name="calendar-outline" size={20}/>
                            }
                            editable={false}
                            containerStyle={{width: Dimensions.get('screen').width/2}}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => {
                        setShowDate(true);
                        setMode("time");
                    }}>
                        <TextInput
                            value={getTime(date)}
                            leftContent={
                                <Ionicons name="time-outline" size={20}/>
                            }
                            editable={false}
                            containerStyle={{width: Dimensions.get('screen').width/2}}
                        />
                    </TouchableOpacity>
                </View>
                

                <DateTimePickerModal isVisible={showDate} date={date}
                    mode={mode} onConfirm={changeDate} onCancel={() => setShowDate(false)}/>

                <TextInput
                    placeholder="Description"
                    value={description}
                    onChangeText={(val) => setDescription(val)}
                    containerStyle={{paddingBottom:40}}
                    multiline={true}
                    leftContent={
                        <Ionicons name="document-text-outline" size={20}/>
                    }
                />
                <Button disabled={disabled} text="Post"
                    status="success" onPress={function () {
                        db.collection("Public Events").add({
                            title: title,
                            location: location,
                            date: date,
                            time: time,
                            description: description
                        }).then(r => {
                            alert("POST SUCCESSFUL");
                            navigation.navigate("Explore")
                        })
                    }}/>
            </Section>
        </Layout>
    );
}