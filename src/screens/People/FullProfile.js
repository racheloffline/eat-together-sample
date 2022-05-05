//Functionality TDB, most likely to be used to implement ice-breaker games

import React from "react";
import { View, ScrollView, StyleSheet, Image, Dimensions } from "react-native";
import {
  Layout,
  TopNav,
  Text,
  themeColor,
  useTheme,
  Button
} from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";

import LargeText from "../../components/LargeText";
import MediumText from "../../components/MediumText";
import Tag from "../../components/Tag";
import TagsList from "../../components/TagsList";

const FullProfile = ({ route, navigation }) => {
  return (
    <Layout>
      <TopNav
        middleContent="View Profile"
        leftContent={
          <Ionicons
            name="chevron-back"
            size={20}
          />
        }
        leftAction={() => navigation.goBack()}
      />
      <View style={styles.page}>
        <View style={styles.background}/>
        <Image style={styles.image}
          source={{uri: route.params.person.image}}/>
        <View style={styles.name}>
          <LargeText>{route.params.person.name}</LargeText>
        </View>

        <TagsList tags={route.params.person.tags}/>

        <MediumText>"{route.params.person.quote}"</MediumText>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  page: {
    paddingTop: 30,
    alignItems: "center",
    paddingHorizontal: 10
  },

  background: {
    position: "absolute",
    width: Dimensions.get('screen').width,
    height: 100,
    backgroundColor: "#5DB075"
  },

  image: {
    width: 100,
    height: 100,
    borderColor: "white",
    borderWidth: 3,
    borderRadius: 50
  },

  name: {
    marginVertical: 20
  },
});

export default FullProfile;