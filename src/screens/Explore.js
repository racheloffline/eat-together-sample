//Display potential friends to share meals with

import React from "react";
import {View, Linking, Image, SafeAreaView, ImageBackground} from "react-native";
import * as firebase from "firebase";
import Invite from "../screens/Invite";
import Card from '../components/Card'
import {
  Layout,
  Button,
  Text,
  TopNav,
  Section,
  SectionContent,
  useTheme,
} from "react-native-rapi-ui";
export default function ({ navigation }) {
  const { isDarkmode, setTheme } = useTheme();
  return (
    <Layout>
    <View
        style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            marginHorizontal: 50
        }}
    >
        <Text>Events and other cool things going on will be displayed here!</Text>
    </View>
    </Layout>
  );
}
