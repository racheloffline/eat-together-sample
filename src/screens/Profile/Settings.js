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

export default function ({ route, navigation }) {
    const [name, setName] = useState('');
    const [quote, setQuote] = useState('');
    const [image, setImage] = useState('');
    const [tags, setTags] = useState([]);

    useEffect(() => {
        setName(route.params.user.name);
        setQuote(route.params.user.quote);
        setImage(route.params.image);
        setTags(route.params.user.tags);
    }, []);

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

    const updateImage = async () => {
        const response = await fetch(image);
        const blob = await response.blob();

        var ref = storage.ref().child("profilePictures/" + route.params.user.id);
        return ref.put(blob);
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
                    <MediumText>Settings</MediumText>
                }
                leftContent={
                    <Ionicons
                        name="chevron-back"
                        size={20}
                    />
                }
                leftAction={() => navigation.goBack()}
            />

            <KeyboardAvoidingView behavior="position" style={{flex: 1}}>
                <View style={styles.imageContainer}>
                    <Image style={styles.image} source={image ? {uri: image} : require("../../../assets/logo.png")}/>
                    <TouchableOpacity style={styles.editImage} onPress={pickImage}>
                        <Feather name="edit-2" size={25} color="black"/>
                    </TouchableOpacity>
                </View>

                <TextInput
                    placeholder="Name"
                    onChangeText={(val) => setName(val)}
                    leftContent={
                        <Ionicons name="person-circle-outline" size={20} />
                    }
                    value={name}
                />

                <TextInput
                    placeholder="Quote"
                    onChangeText={(val) => setQuote(val)}
                    leftContent={
                        <Ionicons name="chatbox-ellipses-outline" size={20}/>
                    }
                    value={quote}
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

                <TouchableOpacity disabled={name === "" || quote === "" || tags.length < 3 || tags.length > 6}
                    style={name === "" || quote === "" || tags.length < 3 || tags.length > 6 ? styles.saveDisabled : styles.save} 
                    onPress={function () {
                    route.params.updateInfo(name, quote, tags, image);

                    db.collection("Users").doc(route.params.user.id).update({
                        name: name,
                        quote: quote,
                        tags: tags,
                        hasImage: image !== ""
                    }).then(() => {
                        if (image !== "") {
                            updateImage();
                        }
                        
                        alert("Profile Updated");
                    });
                }}>
                    <MediumText color="#5DB075">Update Profile</MediumText>
                </TouchableOpacity>

                <Button onPress={() => signOut()}
                    marginVertical={20}>Log Out</Button>
            </KeyboardAvoidingView>
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
