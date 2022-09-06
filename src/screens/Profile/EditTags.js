// Specify availabilities for days of the week

import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { Layout, TextInput } from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";
import RBSheet from "react-native-raw-bottom-sheet";

import LargeText from "../../components/LargeText";
import MediumText from "../../components/MediumText";
import NormalText from "../../components/NormalText";

import TagsSection from "../../components/TagsSection";
import Button from "../../components/Button";

import schoolTags from "../../schoolTags";
import hobbyTags from "../../hobbyTags";
import foodTags from "../../foodTags";
import { cloneDeep } from "lodash";

const EditTags = props => {
  // Tags
  const [schoolTagsSelected, setSchoolTagsSelected] = useState(props.route.params.schoolTags);
  const [hobbyTagsSelected, setHobbyTagsSelected] = useState(props.route.params.hobbyTags);
  const [foodTagsSelected, setFoodTagsSelected] = useState(props.route.params.foodTags);
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
      if (schoolTagsSelected.length > 0) {
          tags += schoolTagsSelected[0];
      }

      for (let i = 1; i < schoolTagsSelected.length; i++) {
          tags += ", " + schoolTagsSelected[i];
      }

      setSchoolTagsValue(tags);
  }, [schoolTagsSelected]);

  useEffect(() => {
      let tags = "";
      if (hobbyTagsSelected.length > 0) {
          tags += hobbyTagsSelected[0];
      }

      for (let i = 1; i < hobbyTagsSelected.length; i++) {
          tags += ", " + hobbyTagsSelected[i];
      }

      setHobbyTagsValue(tags);
  }, [hobbyTagsSelected]);

  useEffect(() => {
      let tags = "";
      if (foodTagsSelected.length > 0) {
          tags += foodTagsSelected[0];
      }

      for (let i = 1; i < foodTagsSelected.length; i++) {
          tags += ", " + foodTagsSelected[i];
      }

      setFoodTagsValue(tags);
  }, [foodTagsSelected]);

  return (
    <Layout style={styles.page}>
        <LargeText center>Edit your tags!</LargeText>
        <NormalText center size={12} marginBottom={30}>Note: each category must contain between 1 to 4 tags.</NormalText>

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
                marginHorizontal={10}>Cancel</Button>
            <Button onPress={() => {
                props.route.params.updateTags(schoolTagsSelected, hobbyTagsSelected, foodTagsSelected);
                props.navigation.goBack();
                alert("Tags saved! Click on 'Update Profile' to update your profile.");
            }}
              disabled={schoolTagsSelected.length < 1 || schoolTagsSelected.length > 4 || hobbyTagsSelected.length < 1
                || hobbyTagsSelected.length > 4 || foodTagsSelected.length < 1 || foodTagsSelected.length > 4}
              marginHorizontal={10}>Save</Button>
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
                    selectedItems={schoolTagsSelected}
                    onItemSelect={(item) => {
                        setSchoolTagsSelected([...schoolTagsSelected, item]);
                    }}
                    onRemoveItem={(item, index) => {
                        const newTags = schoolTagsSelected.filter((tag, i) => i !== index);
                        setSchoolTagsSelected(newTags);
                    }}
                    items={cloneDeep(schoolTags)}
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
                    selectedItems={hobbyTagsSelected}
                    onItemSelect={(item) => {
                        setHobbyTagsSelected([...hobbyTagsSelected, item]);
                    }}
                    onRemoveItem={(item, index) => {
                        const newTags = hobbyTagsSelected.filter((tag, i) => i !== index);
                        setHobbyTagsSelected(newTags);
                    }}
                    items={cloneDeep(hobbyTags)}
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
                    selectedItems={foodTagsSelected}
                    onItemSelect={(item) => {
                        setFoodTagsSelected([...foodTagsSelected, item]);
                    }}
                    onRemoveItem={(item, index) => {
                        const newTags = foodTagsSelected.filter((tag, i) => i !== index);
                        setFoodTagsSelected(newTags);
                    }}
                    items={cloneDeep(foodTags)}
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

export default EditTags;