import React, { useState, useEffect, useContext } from "react";
import { View, StyleSheet, Image, Dimensions, TouchableOpacity } from 'react-native';
import { Layout, TopNav, TextInput } from "react-native-rapi-ui";
import { Ionicons, Feather, FontAwesome } from '@expo/vector-icons';

import * as ImagePicker from 'expo-image-picker';
import { db, storage } from "../../provider/Firebase";

import Button from "../../components/Button";
import MediumText from "../../components/MediumText";
import DeviceToken from "../utils/DeviceToken";
import KeyboardAvoidingWrapper from "../../components/KeyboardAvoidingWrapper";

import { AuthContext } from "../../provider/AuthProvider";
import { checkProfanity } from "../../methods";

import timeSlots from "../../timeSlots";

import { cloneDeep } from "lodash";

export default function edit({ route, navigation }) {
    // Input fields
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [pronouns, setPronouns] = useState('');
    const [bio, setBio] = useState('');
    const [tags, setTags] = useState([]);
    const [tagText, setTagText] = useState('');

    // Days
    const [monday, setMonday] = useState(cloneDeep(timeSlots));
    const [tuesday, setTuesday] = useState(cloneDeep(timeSlots));
    const [wednesday, setWednesday] = useState(cloneDeep(timeSlots));
    const [thursday, setThursday] = useState(cloneDeep(timeSlots));
    const [friday, setFriday] = useState(cloneDeep(timeSlots));
    const [saturday, setSaturday] = useState(cloneDeep(timeSlots));
    const [sunday, setSunday] = useState(cloneDeep(timeSlots));

    // Used to check if image has been updated or not; if not, don't update the DB
    const [oldImage, setOldImage] = useState('');
    const [image, setImage] = useState('');

    const [loading, setLoading] = useState(false); // Disabling button if user profile is being updated

    const updateProfileImg = useContext(AuthContext).updateProfileImg;

    useEffect(() => {
        setFirstName(route.params.user.firstName);
        setLastName(route.params.user.lastName);
        setPronouns(route.params.user.pronouns);
        setBio(route.params.user.bio);
        setOldImage(route.params.user.image);
        setImage(route.params.user.image);
        setTags(route.params.user.tags);
        setTagText(displayTags(route.params.user.tags));
        setMonday(route.params.user.availabilities.monday);
        setTuesday(route.params.user.availabilities.tuesday);
        setWednesday(route.params.user.availabilities.wednesday);
        setThursday(route.params.user.availabilities.thursday);
        setFriday(route.params.user.availabilities.friday);
        setSaturday(route.params.user.availabilities.saturday);
        setSunday(route.params.user.availabilities.sunday);
        console.log("am i available on FRIDAY? " + friday[0].available);
    }, []);

    // Display text for tags
    const displayTags = tags => {
        if (tags.length > 0) {
            let string = tags[0].tag;
            for (let i = 1; i < tags.length; i++) {
                string += ", " + tags[i].tag;
            }

            return string;
        }

        return "";
    }

    // Select image from library
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.cancelled) {
            setImage(result.uri);
        }
    };

    // Upload image to firebase
    const updateImage = async () => {
        if(!image) return;
        const response = await fetch(image);
        const blob = await response.blob();

        var ref = storage.ref().child("profilePictures/" + route.params.user.id);
        return ref.put(blob);
    }

    // Fetches image from Firebase Storage
    const fetchImage = async () => {
        let ref = storage.ref().child("profilePictures/" + route.params.user.id);
        return ref.getDownloadURL();
    }

    // Update user profile in Firebase
    const updateUser = async () => {
        if (checkProfanity(firstName) || checkProfanity(lastName)) {
            alert("Name has inappropriate words >:(");
        } else if (checkProfanity(pronouns)) {
            alert("Pronouns have inappropriate words >:(");
        } else if (checkProfanity(bio)) {
            alert("Fun fact has inappropriate words >:(");
        } else {
            route.params.updateInfo(firstName, lastName, pronouns, bio, tags, image);

            if (image !== oldImage) {
                await updateImage().then(() => {
                    fetchImage().then((uri) => {
                        updateProfileImg(uri);
                        db.collection("Users").doc(route.params.user.id).update({
                            firstName,
                            lastName,
                            pronouns,
                            bio,
                            tags,
                            hasImage: !(!image),
                            image: uri
                        }).then(() => {
                            alert("Profile updated!");
                            navigation.goBack();
                            updateEventsPfp(uri);
                        });
                    });
                });
            } else {
                await db.collection("Users").doc(route.params.user.id).update({
                    firstName,
                    lastName,
                    pronouns,
                    bio,
                    tags
                }).then(() => {
                    alert("Profile updated!");
                    navigation.goBack();
                });
            }
        }
    }

    // Update profile pic in each event user is hosting
    const updateEventsPfp = image => {
        route.params.user.hostedEventIDs.forEach(id => {
            let table = "Public Events";
            if (id.type == "private") {
                table = "Private Events";
            }

            db.collection(table).doc(id.id).update({
                hasHostImage: true,
                hostImage: image
            });
        });
    }

    // Update tags after editing them
    const updateTags = (schoolTags, hobbyTags, foodTags) => {
        schoolTags = schoolTags.map(tag => {
            return {
                tag: tag,
                type: "school"
            }
        });
        hobbyTags = hobbyTags.map(tag => {
            return {
                tag: tag,
                type: "hobby"
            }
        });
        foodTags = foodTags.map(tag => {
            return {
                tag: tag,
                type: "food"
            }
        });

        setTags([...schoolTags, ...hobbyTags, ...foodTags]);
        setTagText(displayTags([...schoolTags, ...hobbyTags, ...foodTags]));
    }

    return (
        <Layout style = {styles.page}>
            <TopNav
                middleContent={
                    <MediumText>Edit Profile</MediumText>
                }
                leftContent={
                    <Ionicons
                        name="chevron-back"
                        size={20}
                    />
                }
                leftAction={() => navigation.goBack()}
            />

            <KeyboardAvoidingWrapper>
                <View style={{ paddingHorizontal: 20 }}>
                    <View style={styles.imageContainer}>
                        <Image style={styles.image} source={image ? {uri: image} : require("../../../assets/logo.png")}/>
                        <TouchableOpacity style={styles.editImage} onPress={pickImage}>
                            <Feather name="edit-2" size={25} color="black"/>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.name}>
                        <TextInput
                            placeholder="First name"
                            onChangeText={(val) => setFirstName(val)}
                            leftContent={
                                <Ionicons name="person-circle-outline" size={20} />
                            }
                            value={firstName}
                            containerStyle={{ width: "47%" }}
                        />
                        <TextInput
                            placeholder="Last name"
                            onChangeText={(val) => setLastName(val)}
                            leftContent={
                                <Ionicons name="person-circle-outline" size={20} />
                            }
                            value={lastName}
                            containerStyle={{ width: "47%" }}
                        />
                    </View>

                    <TextInput
                        placeholder="Pronouns (he/him, she/her, etc.)"
                        onChangeText={(val) => setPronouns(val)}
                        leftContent={
                            <FontAwesome name="quote-left" size={20}/>
                        }
                        value={pronouns}
                        containerStyle={{ marginBottom: 10 }}
                    />

                    <TextInput
                        placeholder="Fun fact (10 to 100 characters)"
                        onChangeText={(val) => setBio(val)}
                        leftContent={
                            <FontAwesome name="exclamation" size={20}/>
                        }
                        value={bio}
                        containerStyle={{ marginBottom: 10 }}
                    />

                    <TouchableOpacity onPress={() => navigation.navigate("EditTags", {
                        schoolTags: tags.filter(tag => tag.type === "school").map(tag => tag.tag),
                        hobbyTags: tags.filter(tag => tag.type === "hobby").map(tag => tag.tag),
                        foodTags: tags.filter(tag => tag.type === "food").map(tag => tag.tag),
                        updateTags
                    })}>
                        <View pointerEvents="none">
                            <TextInput
                                placeholder="Tags"
                                onChangeText={(val) => setBio(val)}
                                leftContent={
                                    <Ionicons name="pricetag" size={20}/>
                                }
                                value={tagText}
                                editable={false}
                            />
                        </View>
                    </TouchableOpacity>

                    <Button onPress={() => navigation.navigate("AvailabilitiesHome",
                        {monday: {monday},
                        setMonday: {setMonday},
                        tuesday: {tuesday},
                        setTuesday: {setTuesday},
                        wednesday: {wednesday},
                        setWednesday: {setWednesday},
                        thursday: {thursday},
                        setThursday: {setThursday},
                        friday: {friday},
                        setFriday: {setFriday},
                        saturday: {saturday},
                        setSaturday: {setSaturday},
                        sunday: {sunday},
                        setSunday: {setSunday}
                        })}
                        >
                    "hi"
                    </Button>

                    <Button disabled={firstName === "" || lastName === "" || bio === "" || loading}
                        marginVertical={40}
                        onPress={async () => {
                            setLoading(true);
                            await updateUser();
                            setLoading(false);
                        }}>
                        {loading ? "Updating ..." : "Update Profile"}
                    </Button>
                </View>
            </KeyboardAvoidingWrapper>
        </Layout>
    );
}
const styles = StyleSheet.create({
    image: {
        width: 150,
        height: 150,
        borderColor: "#5DB075",
        borderWidth: 3,
        borderRadius: 100,
        alignItems: 'center'
    },

    tagInput: {
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        marginVertical: 10
    },

    input: {
        width: Dimensions.get('screen').width/1.5,
        marginRight: 10
    },

    imageContainer: {
        marginTop: 30,
        alignItems: "center"
    },

    editImage: {
        left: 45,
        bottom: 45,
        padding: 12,
        backgroundColor: "#5DB075",
        borderRadius: 100
    },

    name: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10
    }
});



