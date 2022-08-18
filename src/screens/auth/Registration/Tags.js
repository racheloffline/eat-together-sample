// Specify availabilities for days of the week

import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { Layout, TextInput } from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";
import RBSheet from "react-native-raw-bottom-sheet";

import LargeText from "../../../components/LargeText";
import MediumText from "../../../components/MediumText";
import NormalText from "../../../components/NormalText";

import TagsSection from "../../../components/TagsSection";
import Button from "../../../components/Button";

import allTags from "../../../allTags";
import { cloneDeep } from "lodash";

const Tags = props => {
  // Tags
  const [schoolTags, setSchoolTags] = useState(props.schoolTags);
  const [hobbyTags, setHobbyTags] = useState(props.hobbyTags);
  const [foodTags, setFoodTags] = useState(props.foodTags);
  const [schoolTagsValue, setSchoolTagsValue] = useState("");
  const [hobbyTagsValue, setHobbyTagsValue] = useState("");
  const [foodTagsValue, setFoodTagsValue] = useState("");

  // Determine which category is open in the drawer
  const [school, setSchool] = useState(false);
  const [hobby, setHobby] = useState(false);
  const [food, setFood] = useState(false);

  const refRBSheet = useRef(); // To toggle the bottom drawer on/off

  // Determines text to display for tags
  useEffect(() => {
      let tags = "";
      if (schoolTags.length > 0) {
          tags += schoolTags[0];
      }

      for (let i = 1; i < schoolTags.length; i++) {
          tags += ", " + schoolTags[i];
      }

      setSchoolTagsValue(tags);
  }, [schoolTags]);

  useEffect(() => {
      let tags = "";
      if (hobbyTags.length > 0) {
          tags += hobbyTags[0];
      }

      for (let i = 1; i < hobbyTags.length; i++) {
          tags += ", " + hobbyTags[i];
      }

      setHobbyTagsValue(tags);
  }, [hobbyTags]);

  useEffect(() => {
      let tags = "";
      if (foodTags.length > 0) {
          tags += foodTags[0];
      }

      for (let i = 1; i < foodTags.length; i++) {
          tags += ", " + foodTags[i];
      }

      setFoodTagsValue(tags);
  }, [foodTags]);

  return (
    <Layout style={styles.page}>
        <LargeText center>Next, add some tags!</LargeText>
        <NormalText center size={12} marginBottom={30}>Note: between 1 and 3 tags are required per category.</NormalText>

        <View style={styles.tagSection}>
            <MediumText center marginBottom={5}>School</MediumText>
            <NormalText center marginBottom={5}>E.g. year, major</NormalText>
            <TouchableOpacity onPress={() => {
                setHobby(false);
                setFood(false);
                setSchool(true);
                refRBSheet.current.open();
            }}>
                <TextInput
                    placeholder="Tags"
                    value={schoolTagsValue}
                    leftContent={
                        <Ionicons name="pricetags-outline" size={20}/>
                    }
                    editable={false}
                />
            </TouchableOpacity>
        </View>

        <View style={styles.tagSection}>
            <MediumText center marginBottom={5}>Hobbies</MediumText>
            <NormalText center marginBottom={5}>E.g. sports, reading</NormalText>
            <TouchableOpacity onPress={() => {
                setSchool(false);
                setFood(false);
                setHobby(true);
                refRBSheet.current.open();
            }}>
                <TextInput
                    placeholder="Tags"
                    value={hobbyTagsValue}
                    leftContent={
                        <Ionicons name="pricetags-outline" size={20}/>
                    }
                    editable={false}
                />
            </TouchableOpacity>
        </View>

        <View style={styles.tagSection}>
            <MediumText center marginBottom={5}>Food-related</MediumText>
            <NormalText center marginBottom={5}>E.g. favorite dishes, favorite cuisine</NormalText>
            <TouchableOpacity onPress={() => {
                setSchool(false);
                setHobby(false);
                setFood(true);
                refRBSheet.current.open();
            }}>
                <TextInput
                    placeholder="Tags"
                    value={foodTagsValue}
                    leftContent={
                        <Ionicons name="pricetags-outline" size={20}/>
                    }
                    editable={false}
                />
            </TouchableOpacity>
        </View>

        <View style={styles.buttons}>
            <Button onPress={() => props.navigation.goBack()}
              marginHorizontal={10}>Back</Button>
            <Button onPress={() => props.navigation.navigate("Email")}
              marginHorizontal={10}>Next</Button>
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
            {school ? (
              <View>
                <MediumText center marginBottom={5}>School</MediumText>
                <NormalText center marginBottom={5}>E.g. year, major</NormalText>
                <TagsSection
                    multi={true}
                    selectedItems={schoolTags}
                    onItemSelect={(item) => {
                        setSchoolTags([...schoolTags, item]);
                    }}
                    onRemoveItem={(item, index) => {
                        const newTags = schoolTags.filter((tag, i) => i !== index);
                        setSchoolTags(newTags);
                    }}
                    items={cloneDeep(allTags)}
                    chip={true}
                    resetValue={false}
                />
              </View>
            ) : hobby ? (
              <View>
                <MediumText center marginBottom={5}>Hobbies</MediumText>
                <NormalText center marginBottom={5}>E.g. sports, reading</NormalText>
                <TagsSection
                    multi={true}
                    selectedItems={hobbyTags}
                    onItemSelect={(item) => {
                        setHobbyTags([...hobbyTags, item]);
                    }}
                    onRemoveItem={(item, index) => {
                        const newTags = hobbyTags.filter((tag, i) => i !== index);
                        setHobbyTags(newTags);
                    }}
                    items={cloneDeep(allTags)}
                    chip={true}
                    resetValue={false}
                />
              </View>
            ) : (
              <View>
                <MediumText center marginBottom={5}>Food-related</MediumText>
                <NormalText center marginBottom={5}>E.g. favorite dishes, favorite cuisine</NormalText>
                <TagsSection
                    multi={true}
                    selectedItems={foodTags}
                    onItemSelect={(item) => {
                        setFoodTags([...foodTags, item]);
                    }}
                    onRemoveItem={(item, index) => {
                        const newTags = foodTags.filter((tag, i) => i !== index);
                        setFoodTags(newTags);
                    }}
                    items={cloneDeep(allTags)}
                    chip={true}
                    resetValue={false}
                />
              </View>
            )}
        </RBSheet>
    </Layout>
  );
}

const styles = StyleSheet.create({
  page: {
    alignItems: "center",
    width: Dimensions.get('screen').width,
    paddingHorizontal: 10,
    paddingVertical: 30
  },

  tagSection: {
    marginBottom: 20,
    width: "90%",
    justifyContent: "center"
  },

  buttons: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 40
  }  
});

export default Tags;