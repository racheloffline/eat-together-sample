import React, { useState, useEffect, useRef } from "react";
import {
    View,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    StyleSheet,
    ImageBackground
} from "react-native";
import { Layout  } from "react-native-rapi-ui";
import { TextInput } from 'react-native-rapi-ui';
import { Ionicons } from "@expo/vector-icons";
import DateTimePickerModal from "react-native-modal-datetime-picker";

import Header from "../../components/Header";
import getDate from "../../getDate";
import getTime from "../../getTime";
import HorizontalSwitch from "../../components/HorizontalSwitch";
import Button from "../../components/Button";

import * as ImagePicker from 'expo-image-picker';
import { db, auth } from "../../provider/Firebase";
import moment from "moment";
import { checkProfanity } from "../../methods";

export default function ({ navigation }) {
    // State variables for the inputs
    const [photo, setPhoto] = useState("https://images.unsplash.com/photo-1504674900247-0877df9cc836?crop=entropy&cs=tinysrgb&fm=jpg&ixlib=rb-1.2.1&q=60&raw_url=true&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8Zm9vZHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=1400");
    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const [date, setDate] = useState(new Date());
    const [additionalInfo, setAdditionalInfo] = useState("");

    // Other variables
    const [showDate, setShowDate] = useState(false);
    const [mode, setMode] = useState("date");
    const [disabled, setDisabled] = useState(true);
    const [unread, setUnread] = useState(false);

    const uid = auth.currentUser.uid; //Current user's uid (to get notif)

    // Checks whether we should disable the Post button or not
    useEffect(() => {
        async function fetchData() {
            // Disable button or not
            if (name === "" || location == "") {
                setDisabled(true);
            } else {
                setDisabled(false);
            }

            await db.collection("Users").doc(uid).onSnapshot((doc) => {
                setUnread(doc.data().hasNotif);
            })
        }
        fetchData();
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
    }

    // For selecting a photo
    const handleChoosePhoto = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            quality: 1,
        });
        if (!result.cancelled) {
            setPhoto(result.uri);
        }
    }

    return (
        <Layout>
            <Header name="Organize"/>
            <HorizontalSwitch left="Private" right="Public" current="left" press={(val) => navigation.navigate("OrganizePublic")}/>
            
            <TouchableOpacity onPress={() => handleChoosePhoto()}>
                <ImageBackground source={{ uri: photo }} style={styles.image}>
                    <View style={styles.imageOverlay}>
                        <Ionicons name="md-image-outline" color="white" size={30}></Ionicons>
                    </View>
                </ImageBackground>
            </TouchableOpacity>

            <View style={{ flex: 1 }}>
                <ScrollView style={styles.content}>
                    <TextInput
                        placeholder="Meal Name"
                        value={name}
                        onChangeText={(val) => {
                            setName(val);
                        }}
                        leftContent={
                            <Ionicons name="chatbubble-outline" size={20} />
                        }
                        containerStyle={styles.input}
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
                        containerStyle={styles.input}
                    />

                    <View style={styles.dateTime}>
                        <TouchableOpacity onPress={() => {
                            setShowDate(true);
                            setMode("date");
                        }} style={styles.smallInput}>
                            <TextInput
                                value={getDate(date)}
                                leftContent={
                                    <Ionicons name="calendar-outline" size={20}/>
                                }
                                editable={false}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => {
                            setShowDate(true);
                            setMode("time");
                        }} style={styles.smallInput}>
                            <TextInput
                                value={getTime(date)}
                                leftContent={
                                    <Ionicons name="time-outline" size={20}/>
                                }
                                editable={false}
                            />
                        </TouchableOpacity>
                    </View>

                    <DateTimePickerModal isVisible={showDate} date={date}
                        mode={mode} onConfirm={changeDate} onCancel={() => setShowDate(false)}
                        minimumDate={new Date()} maximumDate={moment().add(1, "months").toDate()}/>

                    <TextInput
                        placeholder="Additional Info"
                        value={additionalInfo}
                        onChangeText={(val) => setAdditionalInfo(val)}
                        containerStyle={{...styles.input, paddingBottom: 60}}
                        multiline={true}
                        leftContent={
                            <Ionicons name="document-text-outline" size={20}/>
                        }
                    />
                    <Button disabled={disabled} onPress={() => {
                        if (checkProfanity(name)) {
                            alert("Name has inappropriate words >:(");
                        } else if (checkProfanity(location)) {
                            alert("Location has inappropriate words >:(");
                        } else if (checkProfanity(additionalInfo)) {
                            alert("Additional info has inappropriate words >:(");
                        } else {
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
                        }
                    }} marginVertical={20}>See people available!</Button>
                </ScrollView>
            </View>
        </Layout>
    );
}

const styles = StyleSheet.create({
    content: {
        paddingHorizontal: 20
    },

    imageOverlay: {
        position: "absolute",
        right: 15,
        top: 15,
        padding: 5,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        borderRadius: 10
    },

    input: {
        marginTop: 10
    },

    image: {
        width: Dimensions.get('screen').width,
        height: 150
    },

    dateTime: {
        marginTop: 10,
        flexDirection: "row",
        justifyContent: "space-between"
    },

    smallInput: {
        width: "47%"
    }
});
