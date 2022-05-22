import React, {useState, useEffect} from "react";
import {Layout, Section, SectionImage, Text, TopNav, TextInput} from "react-native-rapi-ui";
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import {db} from "../../provider/Firebase";
import firebase from "firebase";
import { getDatabase, ref, set } from "firebase/database";
import Button from "../../components/Button";
import {View, ScrollView, StyleSheet, Image, Dimensions, ImageBackground, TouchableOpacity} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import MediumText from "../../components/MediumText";
import TagsList from "../../components/TagsList";
import SmallText from "../../components/SmallText";
import Link from "../../components/Link";


export default function ({ navigation }) {
    const [name, setName] = React.useState('');
    const [username, setUsername] = React.useState('');
    const [quote, setQuote] = React.useState('');
    const [image, setImage] = React.useState('');
    const [tags, setTags] = React.useState([]);
    const [currentTag, setCurrentTag] = useState(""); // Current tag the user typed out

      const addTag = () => {
        setTags([...tags, currentTag]);
        setCurrentTag("");
      }
    const user = firebase.auth().currentUser;

    useEffect(() => {
        const ref = db.collection("Users");
            ref.onSnapshot((query) => {
                query.forEach(doc => {
                    if (doc.data().id === user.uid) {
                        setImage(doc.data().image);
                        setName(doc.data().name);
                        setQuote(doc.data().quote);
                        setUsername(doc.data().username);
                        setTags(doc.data().tags);
                    }
                });
            });
    }, []);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({});
        if (!result.cancelled) {
            setImage(result.uri);
        }
    };

    return (
        <Layout style = {styles.page}>
        <TopNav
            middleContent="Settings"
            leftContent={
            <Ionicons
                name="chevron-back"
                size={20}
            />
           }
           leftAction={() => navigation.goBack()}
           />
            <Section>
                    <View style = {{alignItems: 'center'}}>
                    <Image style={styles.image} source={{uri: image}}/>
                    </View>
                    <TouchableOpacity style={{alignItems: 'center'}} onPress={() => pickImage()}>
                        <Text style = {styles.text}> Change profile photo</Text>
                    </TouchableOpacity>
                <TextInput
                    placeholder="Name"
                    onChangeText={(val) => setName(val)}
                    leftContent={
                        <Ionicons name="person-circle-outline" size={20} />
                    }
                />
                <TextInput
                    placeholder="Username"
                    onChangeText={(val) => setUsername(val)}
                        leftContent={
                            <Ionicons name="person-circle-outline" size={20} />
                        }
               />

                <TextInput
                    placeholder="Quote"
                    onChangeText={(val) => setQuote(val)}
                    leftContent={
                    <Ionicons name="chatbox-ellipses-outline" size={20}/>
                    }
                />
                        <View style={styles.tagInput}>
                          <TextInput placeholder="Tag" value={currentTag}
                            containerStyle={styles.input} onChangeText={val => setCurrentTag(val)}
                            leftContent={<FontAwesome name="tag" size={18}/>}/>
                          <Button onPress={addTag} disabled={currentTag === ""}>+</Button>
                        </View>
                        <View style = {{alignItems: 'center'}}>
                        <TagsList tags={tags}/>
                        {tags.length > 0 && <Link size={14} onPress={() => setTags(tags.slice(0, -1))}>Delete Tag</Link>}
                        </View>
                <TouchableOpacity style={{alignItems: 'center'}} onPress={function () {
                    db.collection("Usernames").doc(username).set({
                        id: user.uid
                    });
                    db.collection("Users").doc(user.uid).update({
                        name: name,
                        quote: quote,
                        image: image,
                        username: username,
                        tags:tags,
                    }).then(r => {
                        alert("Profile Updated");
                    })
                }}>
                    <Text style = {styles.text}>Update Profile</Text>
                </TouchableOpacity>

                <Button
                    onPress={() => {
                        firebase.auth().signOut();
                    }}
                marginVertical={5}>Log Out</Button>
            </Section>
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
  text: {
      height: 30,
      alignItems: "center",
      color: "#5DB075",
      fontWeight: "bold",
      marginVertical: 15
    }
});
