//Functionality TDB, most likely to be used to implement ice-breaker games

import React from "react";
import { View, StyleSheet, Image } from "react-native";
import {
  Layout,
  TopNav,
  Text,
  themeColor,
  useTheme,
  Button
} from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";

const FullCard = ({ route, navigation }) => {
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
      
    </Layout>
  );
}

const styles = StyleSheet.create({
    
});

export default FullProfile;