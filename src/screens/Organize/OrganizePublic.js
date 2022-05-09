import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Dimensions, KeyboardAvoidingView } from "react-native";
import { Button, Layout, Section, SectionImage } from "react-native-rapi-ui";
import { TextInput } from 'react-native-rapi-ui';
import { Ionicons } from "@expo/vector-icons";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {db, auth} from "../../provider/Firebase";

import Header from "../../components/Header";
import getDate from "../../getDate";
import getTime from "../../getTime";
import HorizontalSwitch from "../../components/HorizontalSwitch";

export default function ({ navigation }) {
    const user = auth.currentUser;
    // State variables for the inputs
    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const [date, setDate] = useState(new Date());
    const [additionalInfo, setAdditionalInfo] = useState("");

    // Other variables
    const [showDate, setShowDate] = useState(false);
    const [mode, setMode] = useState("date");
    const [disabled, setDisabled] = useState(true);

    // Checks whether we should disable the Post button or not
    useEffect(() => {
        if (name === "" || location == "") {
            setDisabled(true);
        } else {
            setDisabled(false);
        }
    }, [name, location]);

    // For selecting a date and time
    const changeDate = (selectedDate) => {
        const currentDate = selectedDate || date;
        setDate(currentDate); // Set the date
        setShowDate(false); // Exit the date/time picker modal
    }

    return (
        <Layout>
            <KeyboardAvoidingView behavior="position" style={{flex: 1}}>
                <Header name="Organize"/>
                <HorizontalSwitch left="Private" right="Public" current="right" press={(val) => navigation.navigate("OrganizePrivate")}/>
                <SectionImage source={require('../../../assets/food.jpg')} />
                <TextInput
                    placeholder="Event Name"
                    value={name}
                    onChangeText={(val) => {
                        setName(val);
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
                    placeholder="Additional Info"
                    value={additionalInfo}
                    onChangeText={(val) => setAdditionalInfo(val)}
                    containerStyle={{paddingBottom: 60}}
                    multiline={true}
                    leftContent={
                        <Ionicons name="document-text-outline" size={20}/>
                    }
                />
                <Button disabled={disabled} text="Post"
                    status="success" onPress={function () {
                        db.collection("Public Events").add({
                            id: new Date(),
                            hostID: user.uid,
                            name: name,
                            location: location,
                            date: date.toLocaleDateString(),
                            additionalInfo: additionalInfo,
                            attendees: []
                        }).then(r => {
                            alert("Success!");
                            setName("");
                            setLocation("");
                            setDate(new Date());
                            setAdditionalInfo("");
                        });
                    }}/>
            </KeyboardAvoidingView>
        </Layout>
    );
}