// First page of registration

import React, { useState } from "react";
import { View, StyleSheet, Dimensions, Image, TouchableOpacity, KeyboardAvoidingView } from "react-native";
import { TextInput } from "react-native-rapi-ui";
import { Feather, FontAwesome } from '@expo/vector-icons';

import * as ImagePicker from 'expo-image-picker';
import allTags from "../../../tags";

import LargeText from "../../../components/LargeText";
import MediumText from "../../../components/MediumText";
import SmallText from "../../../components/SmallText";
import Button from "../../../components/Button";
import TagsList from "../../../components/TagsList";
import Link from "../../../components/Link";
import TagsSection from "../../../components/TagsSection";

import profaneWords from "./profaneWords";
import { cloneDeep } from "lodash";

const Name = props => {
  // Input fields
  const [name, setName] = useState(props.name);
  const [quote, setQuote] = useState(props.quote);
  const [image, setImage] = useState(props.image);
  const [tags, setTags] = useState(props.tags);

  const [currentTag, setCurrentTag] = useState(""); // Current tag the user typed out
  const badWords = cloneDeep(profaneWords); // List of profane words

  const addTag = () => {
    if (checkProfanity(currentTag)) {
      alert("Inappropriate tag >:(");
    } else {
      setTags([...tags, currentTag]);
    }
  
    setCurrentTag("");
  }

  const checkProfanity = word => {
    const profane = badWords.some(w => word.toLowerCase().includes(w));
    return profane;
  }

  const goNext = () => {
    if (checkProfanity(name) || checkProfanity(quote)) {
      alert("Inappropriate words used >:(");
    } else {
      props.setName(name);
      props.setQuote(quote);
      props.setImage(image);
      props.setTags(tags);
      props.navigation.navigate("Email");
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
    <KeyboardAvoidingView style={styles.page} behavior="position">
      <View style={styles.header}>
        <LargeText color="white" center size={25}>Let's set up your profile!</LargeText>
      </View>

      <View style={styles.imageContainer}>
        {image !== "" ? <Image style={styles.image} source={{uri: image}}/>
          : <Image style={styles.image} source={require("../../../../assets/logo.png")}/>}
        <TouchableOpacity style={styles.editImage} onPress={pickImage}>
          <Feather name="edit-2" size={25} color="black"/>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <TextInput placeholder="What's your name?" value={name}
          onChangeText={val => setName(val)} containerStyle={{marginBottom: 10}}
          leftContent={<FontAwesome name="user" size={18}/>} autoComplete="name"/>
        <TextInput placeholder="Favorite quote (no quotation marks)" value={quote}
          onChangeText={val => setQuote(val)} containerStyle={{marginBottom: 20}}
          leftContent={<FontAwesome name="quote-left" size={18}/>}/>
  
        <MediumText>Add Some Tags:</MediumText>
        <SmallText>Note: between 3 and 6 tags are required.</SmallText>
        <View style={styles.tagInput}>
          <TagsSection
            multi={true}
            selectedItems={tags}
            onItemSelect={(item) => {
              setTags([...tags, item]);
            }}
            onRemoveItem={(item, index) => {
              const newTags = tags.filter((tag, i) => i !== index);
              setTags(newTags);
            }}
            items={cloneDeep(allTags)}
            chip={true}
            resetValue={false}
          />
        </View>

        <View style={styles.buttons}>
          <Button onPress={() => props.navigation.goBack()}
            marginHorizontal={10}>Back</Button>
          <Button disabled={name === "" || quote === "" || tags.length < 3 || tags.length > 6}
            onPress={goNext}
            marginHorizontal={10}>Next</Button>
        </View>
        
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },

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
    width: 125,
    height: 125,
    borderRadius: 125
  },

  editImage: {
    left: 40,
    bottom: 40,
    padding: 12,
    backgroundColor: "#5DB075",
    borderRadius: 100
  },

  content: {
    width: "100%",
    paddingHorizontal: 20,
    alignItems: "center"
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
    marginTop: 30,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center"
  }
});

export default Name;