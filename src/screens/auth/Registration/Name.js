// First page of registration

import React, { useState } from "react";
import { View, StyleSheet, Dimensions, Image, TouchableOpacity } from "react-native";
import { TextInput } from "react-native-rapi-ui";
import { Feather, FontAwesome } from '@expo/vector-icons';

import * as ImagePicker from 'expo-image-picker';
import allTags from "../../../allTags";

import LargeText from "../../../components/LargeText";
import MediumText from "../../../components/MediumText";
import SmallText from "../../../components/SmallText";
import Button from "../../../components/Button";
import TagsSection from "../../../components/TagsSection";
import KeyboardAvoidingWrapper from "../../../components/KeyboardAvoidingWrapper";

import profaneWords from "./profaneWords";
import { cloneDeep } from "lodash";

const Name = props => {
  // Input fields
  const [firstName, setFirstName] = useState(props.firstName);
  const [lastName, setLastName] = useState(props.lastName);
  const [bio, setBio] = useState(props.bio);
  const [image, setImage] = useState(props.image);
  const [tags, setTags] = useState(props.tags);

  const badWords = cloneDeep(profaneWords); // List of profane words

  const checkProfanity = word => {
    const profane = badWords.some(w => word.toLowerCase().includes(w));
    return profane;
  }

  const goNext = () => {
    if (checkProfanity(firstName) || checkProfanity(lastName) || checkProfanity(bio)) {
      alert("Inappropriate words used >:(");
    } else {
      props.setFirstName(firstName);
      props.setLastName(lastName);
      props.setBio(bio);
      props.setImage(image);
      props.setTags(tags);
      props.navigation.navigate("Tags");
    }
  }

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  }

  return (
    <KeyboardAvoidingWrapper>
      <View>
        <View style={styles.header}>
          <LargeText color="white" center size={25}>Let's set up your profile!</LargeText>
        </View>

        <View style={styles.imageContainer}>
          {image !== "" ? <Image style={styles.image} source={{uri: image}}/>
            : <Image style={styles.image} source={require("../../../../assets/logo.png")}/>}
          <TouchableOpacity style={styles.editImage} onPress={pickImage}>
            <Feather name="edit-2" size={24} color="black"/>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.name}>
            <TextInput placeholder="First name" value={firstName} maxLength={20}
              onChangeText={val => setFirstName(val)} containerStyle={{width: "47%"}}
              leftContent={<FontAwesome name="user" size={18}/>} autoComplete="name"/>
            <TextInput placeholder="Last name" value={lastName} maxLength={30}
              onChangeText={val => setLastName(val)} containerStyle={{width: "47%"}}
              leftContent={<FontAwesome name="user" size={18}/>} autoComplete="name"/>
          </View>

          <TextInput placeholder="Fun fact (10 to 100 characters)" value={bio} maxLength={100}
            onChangeText={val => setBio(val)} containerStyle={{marginTop: 20}}
            leftContent={<FontAwesome name="quote-left" size={18}/>}/>

          <View style={styles.buttons}>
            <Button onPress={() => props.navigation.goBack()}
              marginHorizontal={10}>Back</Button>
            <Button disabled={firstName === "" || lastName === "" || bio.length < 10}
              onPress={goNext}
              marginHorizontal={10}>Next</Button>
          </View>    
        </View>
      </View>
    </KeyboardAvoidingWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingVertical: 20,
    width: "100%",
    backgroundColor: "#5DB075"
  },

  imageContainer: {
    marginTop: 30,
    alignItems: "center"
  },

  image: {
    width: 150,
    height: 150,
    borderRadius: 125
  },

  editImage: {
    left: 50,
    bottom: 50,
    padding: 15,
    backgroundColor: "#5DB075",
    borderRadius: 100
  },

  content: {
    paddingHorizontal: 20,
    alignItems: "center"
  },

  name: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10
  },

  tagInput: {
    width: "100%",
    marginVertical: 10
  },

  input: {
    width: Dimensions.get('screen').width/1.5,
    marginRight: 10
  },

  buttons: {
    marginTop: "40%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center"
  }
});

export default Name;