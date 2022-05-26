import React, { useState, useEffect } from "react";
import {View, TouchableOpacity, Dimensions, KeyboardAvoidingView, StyleSheet} from "react-native";
import { Layout, SectionImage  } from "react-native-rapi-ui";
import { TextInput } from 'react-native-rapi-ui';
import { Ionicons } from "@expo/vector-icons";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as ImagePicker from 'expo-image-picker';

import Header from "../../components/Header";
import getDate from "../../getDate";
import getTime from "../../getTime";
import HorizontalSwitch from "../../components/HorizontalSwitch";
import Button from "../../components/Button";

import {auth, storage} from "../../provider/Firebase";
import {ImageBackground} from "react-native";

export default function ({ navigation }) {
    const user = auth.currentUser;

    // State variables for the inputs
    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const [date, setDate] = useState(new Date());
    const [additionalInfo, setAdditionalInfo] = useState("");
    const [photo, setPhoto] = useState("https://images.unsplash.com/photo-1504674900247-0877df9cc836?crop=entropy&cs=tinysrgb&fm=jpg&ixlib=rb-1.2.1&q=60&raw_url=true&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8Zm9vZHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=1400");

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

    const clearAll = () => {
        setName("");
        setLocation("");
        setDate(new Date());
        setAdditionalInfo("");
    };

    const handleChoosePhoto = async () => {
       let result = await ImagePicker.launchImageLibraryAsync({});
       if (!result.cancelled) {
           setPhoto(result.uri);
       }
    };

    return (
        <Layout>
            <KeyboardAvoidingView behavior="position" style={{flex: 1}}>
                <Header name="Organize" navigation={navigation}/>
                <HorizontalSwitch left="Private" right="Public" current="left" press={(val) => navigation.navigate("OrganizePublic")}/>
                <ImageBackground source={{uri: photo}} style={styles.image}>
                <View style={styles.imageOverlay}>
                    <TouchableOpacity onPress={() => handleChoosePhoto()}>
                        <Ionicons name={"create"} color={"white"} size={40}></Ionicons>
                    </TouchableOpacity>
                </View>
                </ImageBackground>
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

                <Button disabled={disabled} onPress={function () {
                    let hasImage = false;
                    if (photo !== "https://images.unsplash.com/photo-1504674900247-0877df9cc836?crop=entropy&cs=tinysrgb&fm=jpg&ixlib=rb-1.2.1&q=60&raw_url=true&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8Zm9vZHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=1400") {
                        hasImage = true;
                    }
                    navigation.navigate("InvitePeople", {
                        name,
                        location,
                        date,
                        additionalInfo: additionalInfo,
                        attendees: [],
                        hasImage: hasImage,
                        image: hasImage ? photo : "",
                        clearAll
                    });
                }} marginVertical={20}>See people available!</Button>
            </KeyboardAvoidingView>
        </Layout>
    );
}

const styles = StyleSheet.create({
    imageOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        margin: 15,
    },
    image: {
        width: '100%',
        height: 150,
    }
});
