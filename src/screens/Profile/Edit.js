import React, { useState, useEffect } from "react";
import { View, StyleSheet, Image, Dimensions, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { Layout, TopNav, TextInput } from "react-native-rapi-ui";
import { Ionicons, Feather } from '@expo/vector-icons';

import * as ImagePicker from 'expo-image-picker';
import { db, storage } from "../../provider/Firebase";
import firebase from "firebase";
import "firebase/firestore"

import { cloneDeep } from "lodash";
import allTags from "../../allTags";

import TagsSection from "../../components/TagsSection";
import Button from "../../components/Button";
import MediumText from "../../components/MediumText";
import SmallText from "../../components/SmallText";
import DeviceToken from "../utils/DeviceToken";
import KeyboardAvoidingWrapper from "../../components/KeyboardAvoidingWrapper";

export default function ({ route, navigation }) {
    // Input fields
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [bio, setBio] = useState('');
    const [image, setImage] = useState('');
    const [tags, setTags] = useState([]);

    const [loading, setLoading] = useState(false); // Disabling button if user profile is being updated

    useEffect(() => {

        setFirstName(route.params.user.firstName);
        setLastName(route.params.user.lastName);
        setBio(route.params.user.bio);
        setImage(route.params.image);
        setTags(route.params.user.tags);
    }, []);

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

        route.params.updateInfo(firstName, lastName, bio, tags, image);

        if (image) {
            await updateImage().then(() => {
                fetchImage().then((uri) => {
                    db.collection("Users").doc(route.params.user.id).update({
                        firstName,
                        lastName,
                        bio,
                        tags,
                        hasImage: !(!image),
                        image: uri
                    }).then(() => {
                        console.log("image: " + image)
                        console.log("uri: " + uri)
                    })
                })
            })
            alert("Profile updated!");
            setLoading(false);
        } else {
            await db.collection("Users").doc(route.params.user.id).update({
                firstName,
                lastName,
                bio,
                tags
            })
            alert("Profile updated!");
            setLoading(false);
        }
    }

    //Sign out, and remove this push token from the list of acceptable push tokens
    const signOut = async () => {
        // let currentToken;
        // await db.collection("Users").doc(route.params.user.id).get().then((ss) => {
        //     currentToken = ss.data().currentToken;
        // })

        await db.collection("Users").doc(route.params.user.id).update({
            pushTokens: firebase.firestore.FieldValue.arrayRemove(DeviceToken.getToken())
        })
        await firebase.auth().signOut()
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
                        placeholder="Bio"
                        onChangeText={(val) => setBio(val)}
                        leftContent={
                            <Ionicons name="chatbox-ellipses-outline" size={20}/>
                        }
                        value={bio}
                        containerStyle={{ marginBottom: 10 }}
                    />

                    <TagsSection
                        multi={true}
                        selectedItems={tags}
                        onItemSelect={(tag) => {
                            setTags([...tags, tag]);
                        }}
                        onRemoveItem={(item, index) => {
                            const newTags = tags.filter((tag, i) => i !== index);
                            setTags(newTags);
                        }}
                        inline={true}
                        items={cloneDeep(allTags)}
                        chip={true}
                        resetValue={false}
                    />

                    <SmallText center>Note: must have between 3 and 6 tags (inclusive).</SmallText>

                    <TouchableOpacity disabled={firstName === "" || lastName === "" || bio === ""
                            || tags.length < 3 || tags.length > 6 || loading}
                        style={firstName === "" || lastName === "" || bio === "" || tags.length < 3
                            || tags.length > 6 ? styles.saveDisabled : styles.save} 
                        onPress={async () => {
                            setLoading(true);
                            await updateUser();
                        }}>
                        <MediumText color="#5DB075">{loading ? "Updating ..." : "Update Profile"}</MediumText>
                    </TouchableOpacity>

                    <Button onPress={() => signOut()}
                        marginVertical={20}>Log Out</Button>
                </View>
            </KeyboardAvoidingWrapper>
        </Layout>
    );
}
const styles = StyleSheet.create({
    image: {
        width: 150,
        height: 150,
        borderColor: "white",
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
        left: 40,
        bottom: 40,
        padding: 12,
        backgroundColor: "#5DB075",
        borderRadius: 100
    },

    name: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10
    },

    save: {
        alignItems: 'center',
        marginVertical: 10
    },

    saveDisabled: {
        alignItems: 'center',
        marginVertical: 10,
        opacity: 0.7
    }
});
