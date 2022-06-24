import React, { useState, useEffect } from "react";
import { View, StyleSheet, Image, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import { Layout, TopNav, TextInput } from "react-native-rapi-ui";
import { FontAwesome, Ionicons, Feather } from '@expo/vector-icons';

import * as ImagePicker from 'expo-image-picker';
import { db, storage } from "../../provider/Firebase";
import firebase from "firebase";
import "firebase/firestore"

import TagsList from "../../components/TagsList";
import Link from "../../components/Link";
import Button from "../../components/Button";

import MediumText from "../../components/MediumText";

export default function ({ route, navigation }) {
    const [name, setName] = useState('');
    const [quote, setQuote] = useState('');
    const [image, setImage] = useState('');
    const [tags, setTags] = useState([]);
    const [currentTag, setCurrentTag] = useState(""); // Current tag the user typed out

    const addTag = () => {
        setTags([...tags, currentTag]);
        setCurrentTag("");
    }

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
        let currentToken;
        await db.collection("Users").doc(route.params.user.id).get().then((ss) => {
            currentToken = ss.data().currentToken;
        })

        await db.collection("Users").doc(route.params.user.id).update({
            currentToken: "",
            pushTokens: firebase.firestore.FieldValue.arrayRemove(currentToken)
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

            <ScrollView>
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

                <View style={styles.tagInput}>
                    <TextInput placeholder="Tag" value={currentTag}
                        containerStyle={styles.input} onChangeText={val => setCurrentTag(val)}
                        leftContent={<FontAwesome name="tag" size={18}/>}/>
                    <Button onPress={addTag} disabled={currentTag === ""} paddingHorizontal={25}>+</Button>
                 </View>

                <View style = {{alignItems: 'center'}}>
                    <TagsList tags={tags}/>
                    {tags.length > 0 && <Link size={14} onPress={() => setTags(tags.slice(0, -1))}>Delete Last Tag</Link>}
                </View>

                <TouchableOpacity style={{alignItems: 'center', marginVertical: 10}} onPress={function () {
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
            </ScrollView>
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
});
