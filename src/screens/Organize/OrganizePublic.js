import React, { useState, useEffect, useRef } from "react";
import {
    View,
    TouchableOpacity,
    StyleSheet,
    ImageBackground,
    Dimensions,
} from "react-native";
import { Layout, TextInput } from "react-native-rapi-ui";
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
import KeyboardAvoidingWrapper from "../../components/KeyboardAvoidingWrapper";

import * as firebase from "firebase";
import * as ImagePicker from "expo-image-picker";
import { db, auth, storage } from "../../provider/Firebase";
import { cloneDeep } from "lodash";

export default function ({ navigation }) {
    // Current user
    const user = auth.currentUser;
    const [userInfo, setUserInfo] = useState({});

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

    const [loading, setLoading] = useState(false); // Disable button if event is being created in Firebase

    const refRBSheet = useRef(); // To toggle the bottom drawer on/off

    // Loading notifications
    useEffect(() => {
        async function fetchData() {
            await db.collection("Users").doc(user.uid).onSnapshot((doc) => {
                setUnread(doc.data().hasNotif);
                setUserInfo(doc.data());
            });
        }

        fetchData();
    }, []);

    // Checks whether we should disable the Post button or not
    useEffect(() => {
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
    }, [name, location, tagsSelected]);

    // For selecting a date and time
    const changeDate = (selectedDate) => {
        const currentDate = selectedDate || date;
        setDate(currentDate); // Set the date
        setShowDate(false); // Exit the date/time picker modal
    };

    // For selecting a photo
    const handleChoosePhoto = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({});
        if (!result.cancelled) {
            setPhoto(result.uri);
        }
    };

    // Stores image in Firebase Storage
    const storeImage = async (uri, event_id) => {
        const response = await fetch(uri);
        const blob = await response.blob();

        let ref = storage.ref().child("eventPictures/" + event_id);
        return ref.put(blob);
    };

    // Fetches image from Firebase Storage
    const fetchImage = async (id) => {
        let ref = storage.ref().child("eventPictures/" + id);
        return ref.getDownloadURL();
    }

    // For posting the event
    const storeEvent = (id, hasImage, image) => {
        db.collection("Public Events").doc(id).set({
            id,
            name,
            hostID: user.uid,
            hostFirstName: userInfo.firstName,
            hostLastName: userInfo.lastName,
            hasHostImage: userInfo.hasImage,
            hostImage: userInfo.hasImage ? userInfo.image : "",
            location,
            date,
            additionalInfo,
            attendees: [user.uid], //ONLY start by putting the current user as an attendee
            hasImage,
            image,
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
                setLoading(false);
            });
        });
    }

    return (
        <Layout>
            <KeyboardAvoidingWrapper>
                <View>
                    <Header name="Organize" navigation={navigation} hasNotif = {unread}/>
                    <HorizontalSwitch left="Private" right="Public" current="right" press={(val) => navigation.navigate("OrganizePrivate")}/>
                    
                    <View style={styles.content}>
                        <TextInput
                            placeholder="Event Name"
                            value={name}
                            onChangeText={(val) => {
                                setName(val);
                            }}
                            leftContent={
                                <Ionicons name="chatbubble-outline" size={20} />
                            }
                            containerStyle={styles.input}
                        />

                        <View style={styles.imageContainer}>
                            <TouchableOpacity onPress={() => handleChoosePhoto()}>
                            <ImageBackground source={{ uri: photo }}
                                style={styles.image} imageStyle={{ borderRadius: 10 }}>
                                <View style={styles.imageOverlay}>
                                    <Ionicons name="md-image-outline" color="white" size={30}></Ionicons>
                                </View>
                            </ImageBackground>
                            </TouchableOpacity>

                            <View style={styles.dateTime}>
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
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                        
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

                        <DateTimePickerModal isVisible={showDate} date={date}
                            mode={mode} onConfirm={changeDate} onCancel={() => setShowDate(false)}/>

                        <TextInput
                            placeholder="Additional Info"
                            value={additionalInfo}
                            onChangeText={(val) => setAdditionalInfo(val)}
                            containerStyle={{...styles.input, paddingBottom: 40}}
                            multiline={true}
                            leftContent={
                                <Ionicons name="document-text-outline" size={20}/>
                            }
                        />

                        <TouchableOpacity onPress={() => refRBSheet.current.open()}
                            style={styles.input}>
                            <TextInput
                                placeholder="Tags"
                                value={tagsValue}
                                leftContent={
                                    <Ionicons name="pricetags-outline" size={20}/>
                                }
                                editable={false}
                            />
                        </TouchableOpacity>

                        <Button disabled={disabled || loading} onPress={function () {
                            setLoading(true);
                            const id = Date.now() + user.uid;
                            let hasImage = false;
                            if (photo !== "https://images.unsplash.com/photo-1504674900247-0877df9cc836?crop=entropy&cs=tinysrgb&fm=jpg&ixlib=rb-1.2.1&q=60&raw_url=true&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8Zm9vZHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=1400") {
                                hasImage = true;
                                storeImage(photo, id).then(() => {
                                    fetchImage(id).then(uri => {
                                        storeEvent(id, hasImage, uri);
                                    });
                                });
                            } else {
                                storeEvent(id, hasImage, "");
                            }
                        }} marginVertical={20}>{loading ? "Posting ..." : "Post"}</Button>
                    </View>

                    <RBSheet
                        height={400}
                        ref={refRBSheet}
                        closeOnDragDown={true}
                        closeOnPressMask={false}
                        customStyles={{
                            wrapper: {
                                backgroundColor: "rgba(0,0,0,0.5)",
                            },
                            draggableIcon: {
                                backgroundColor: "#5DB075"
                            },
                            container: {
                                borderTopLeftRadius: 20,
                                borderTopRightRadius: 20,
                                padding: 10
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
                </View>
            </KeyboardAvoidingWrapper>
        </Layout>
    );
}

const styles = StyleSheet.create({
    content: {
        paddingHorizontal: 20
    },

    imageOverlay: {
        position: "absolute",
        left: 10,
        top: 10,
        padding: 5,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        borderRadius: 10
    },

    input: {
        marginTop: 10
    },

    image: {
        width: 130,
        height: 110
    },

    imageContainer: {
        marginTop: 10,
        flexDirection: "row",
        justifyContent: "space-between"
    },

    dateTime: {
        flexDirection: "column",
        justifyContent: "space-between",
        width: Dimensions.get('screen').width-180
    },
});