import React, { useState, useEffect, useRef } from "react";
import { View, TouchableOpacity, Dimensions, KeyboardAvoidingView, StyleSheet, ImageBackground } from "react-native";
import { Layout } from "react-native-rapi-ui";
import { TextInput } from 'react-native-rapi-ui';
import { Ionicons } from "@expo/vector-icons";
import eventTags from "../../eventTags";

import DateTimePickerModal from "react-native-modal-datetime-picker";
import RBSheet from "react-native-raw-bottom-sheet";
import TagsSection from "../../components/TagsSection";

import Header from "../../components/Header";
import getDate from "../../getDate";
import getTime from "../../getTime";
import HorizontalSwitch from "../../components/HorizontalSwitch";
import Button from "../../components/Button";
import NormalText from "../../components/NormalText";

import * as firebase from "firebase";
import * as ImagePicker from "expo-image-picker";
import { db, auth, storage } from "../../provider/Firebase";
import { cloneDeep } from "lodash";

export default function ({ navigation }) {
    const user = auth.currentUser;
    // State variables for the inputs
    const [photo, setPhoto] = useState("https://images.unsplash.com/photo-1504674900247-0877df9cc836?crop=entropy&cs=tinysrgb&fm=jpg&ixlib=rb-1.2.1&q=60&raw_url=true&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8Zm9vZHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=1400");
    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const [date, setDate] = useState(new Date());
    const [additionalInfo, setAdditionalInfo] = useState("");
    const [tagsSelected, setTagsSelected] = useState([]);
    const [tagsValue, setTagsValue] = useState("");

    // Other variables
    const [showDate, setShowDate] = useState(false);
    const [mode, setMode] = useState("date");
    const [disabled, setDisabled] = useState(true);
    const [unread, setUnread] = useState(false);

    const refRBSheet = useRef(); // To toggle the bottom drawer on/off

    // Checks whether we should disable the Post button or not
    useEffect( () => {
        async function fetchData() {
            await db.collection("Users").doc(user.uid).onSnapshot((doc) => {
                setUnread(doc.data().hasNotif);
            })

            // Disable button or not
            if (name === "" || location == "") {
                setDisabled(true);
            } else {
                setDisabled(false);
            }

            // Determine text to display for selected tags
            let tags = "";
            if (tagsSelected.length > 0) {
                tags += tagsSelected[0];
            }

            for (let i = 1; i < tagsSelected.length; i++) {
                tags += ", " + tagsSelected[i];
            }

            setTagsValue(tags);
        }
        fetchData();
    }, [name, location, tagsSelected]);

    // For selecting a date and time
    const changeDate = (selectedDate) => {
        const currentDate = selectedDate || date;
        setDate(currentDate); // Set the date
        setShowDate(false); // Exit the date/time picker modal
    };

    const handleChoosePhoto = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({});
        if (!result.cancelled) {
            setPhoto(result.uri);
        }
    };

    const storeImage = async (uri, event_id) => {
        const response = await fetch(uri);
        const blob = await response.blob();

        let ref = storage.ref().child("eventPictures/" + event_id);
        return ref.put(blob);
    };

    return (
        <Layout>
            <KeyboardAvoidingView behavior="position" style={{flex: 1}}>
                <Header name="Organize" navigation={navigation} hasNotif = {unread}/>
                <HorizontalSwitch left="Private" right="Public" current="right" press={(val) => navigation.navigate("OrganizePrivate")}/>
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

                <TouchableOpacity onPress={() => refRBSheet.current.open()}>
                    <TextInput
                        placeholder="Tags"
                        value={tagsValue}
                        leftContent={
                            <Ionicons name="pricetags-outline" size={20}/>
                        }
                        editable={false}
                    />
                </TouchableOpacity>

                <RBSheet
                    height={400}
                    ref={refRBSheet}
                    closeOnDragDown={true}
                    closeOnPressMask={false}
                    customStyles={{
                        wrapper: {
                            backgroundColor: "rgba(0,0,0,0.5)"
                        },
                        draggableIcon: {
                            backgroundColor: "#5DB075"
                        },
                        container: {
                            borderTopLeftRadius: 20,
                            borderTopRightRadius: 20,
                        }
                    }}>
                        <NormalText center>Add as many tags as you want :)</NormalText>
                        <TagsSection
                            multi={true}
                            selectedItems={tagsSelected}
                            onItemSelect={(item) => {
                                setTagsSelected([...tagsSelected, item]);
                            }}
                            onRemoveItem={(item, index) => {
                                const newTags = tagsSelected.filter((tag, i) => i !== index);
                                setTagsSelected(newTags);
                            }}
                            items={cloneDeep(eventTags)}
                            chip={true}
                            resetValue={false}
                        />
                </RBSheet>

                <Button disabled={disabled} onPress={function () {
                        const id = Date.now() + user.uid;
                        let hasImage = false;
                        if (photo !== "https://images.unsplash.com/photo-1504674900247-0877df9cc836?crop=entropy&cs=tinysrgb&fm=jpg&ixlib=rb-1.2.1&q=60&raw_url=true&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8Zm9vZHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=1400") {
                            storeImage(photo, id);
                            hasImage = true;
                        }
                        db.collection("Public Events").doc(id).set({
                            id,
                            hostID: user.uid,
                            name,
                            location,
                            date,
                            additionalInfo,
                            attendees: [],
                            hasImage,
                            tags: tagsSelected
                        }).then(() => {
                            const storeID = {
                                type: "public",
                                id
                            };

                            db.collection("Users").doc(user.uid).update({
                                hostedEventIDs: firebase.firestore.FieldValue.arrayUnion(storeID),
                                attendingEventIDs: firebase.firestore.FieldValue.arrayUnion(storeID),
                                attendedEventIDs: firebase.firestore.FieldValue.arrayUnion(storeID)
                            }).then(() => {
                                setName("");
                                setLocation("");
                                setDate(new Date());
                                setAdditionalInfo("");
                                setTagsSelected([]);
                                alert("Success!");
                            });
                        });
                    }} marginVertical={20}>Post</Button>
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