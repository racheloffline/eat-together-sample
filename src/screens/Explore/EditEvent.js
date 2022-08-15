import React, { useState, useEffect, useRef } from "react";
import {
    View,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    ImageBackground,
    Dimensions,
} from "react-native";
import { TopNav, Layout, TextInput } from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";
import eventTags from "../../eventTags";

import DateTimePickerModal from "react-native-modal-datetime-picker";
import RBSheet from "react-native-raw-bottom-sheet";
import TagsSection from "../../components/TagsSection";

import getDate from "../../getDate";
import getTime from "../../getTime";
import Button from "../../components/Button";

import MediumText from "../../components/MediumText";
import NormalText from "../../components/NormalText";

import * as ImagePicker from "expo-image-picker";
import { db, storage } from "../../provider/Firebase";
import { cloneDeep } from "lodash";
import moment from "moment";

export default function ({ route, navigation }) {
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

    const [loading, setLoading] = useState(false); // Disable button if event is being created in Firebase

    const refRBSheet = useRef(); // To toggle the bottom drawer on/off

    // Get current event info
    useEffect(() => {
        setName(route.params.event.name);
        setLocation(route.params.event.location);
        setDate(route.params.event.date.toDate());
        setAdditionalInfo(route.params.event.additionalInfo);
        setTagsSelected(route.params.event.tags ? route.params.event.tags : []);
        setPhoto(route.params.event.image ? route.params.event.image : photo);
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
        const newEvent = {
            id,
            name,
            hostID: route.params.event.hostID,
            hostFirstName: route.params.event.hostFirstName,
            hostLastName: route.params.event.hostLastName,
            hasHostImage: route.params.event.hasHostImage,
            hostImage: route.params.event.hostImage,
            location,
            date,
            additionalInfo,
            attendees: route.params.event.attendees,
            ice: route.params.event.ice,
            hasImage,
            image
        };

        let table = "Private Events";

        if (route.params.event.type === "public") {
            newEvent.tags = tagsSelected;
            table = "Public Events";
        }

        db.collection(table).doc(route.params.event.id).set(newEvent).then(() => {
            newEvent.date = moment(date);
            route.params.editEvent(newEvent);
            route.params.editEvent2(newEvent);
            navigation.navigate("FullCardPrivate");
            alert("Meal updated!");
        });
    }

    return (
        <Layout>
            <TopNav
                middleContent={
                    <MediumText center>Edit Event</MediumText>
                }
                leftContent={
                    <Ionicons
                        name="chevron-back"
                        color={loading ? "grey" : "black"}
                        size={20}
                    />
                }
                leftAction={() => navigation.goBack()}
            />

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
                        containerStyle={{...styles.input, paddingBottom: 40}}
                        multiline={true}
                        leftContent={
                            <Ionicons name="document-text-outline" size={20}/>
                        }
                    />

                    {route.params.event.type === "public" && <TouchableOpacity onPress={() => refRBSheet.current.open()}
                        style={styles.input}>
                        <TextInput
                            placeholder="Tags"
                            value={tagsValue}
                            leftContent={
                                <Ionicons name="pricetags-outline" size={20}/>
                            }
                            editable={false}
                        />
                    </TouchableOpacity>}

                    <Button disabled={disabled || loading} onPress={() => {
                        setLoading(true);
                        let hasImage = false;
                        if (photo !== "https://images.unsplash.com/photo-1504674900247-0877df9cc836?crop=entropy&cs=tinysrgb&fm=jpg&ixlib=rb-1.2.1&q=60&raw_url=true&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8Zm9vZHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=1400") {
                            hasImage = true;
                            storeImage(photo, route.params.event.id).then(() => {
                                fetchImage(route.params.event.id).then(uri => {
                                    storeEvent(route.params.event.id, hasImage, uri);
                                });
                            });
                        } else {
                            storeEvent(route.params.event.id, hasImage, "");
                        }
                    }} marginVertical={20}>{loading ? "Updating ..." : "Update"}</Button>
                </ScrollView>
            </View>

            {route.params.event.type === "public" && <RBSheet
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
                <NormalText center marginBottom={10}>Add as many tags as you want :)</NormalText>
                <TagsSection
                    multi={true}
                    selectedItems={tagsSelected}
                    onItemSelect={(item) => {
                        console.log("Select");
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
            </RBSheet>}
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
        width: Dimensions.get("screen").width,
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