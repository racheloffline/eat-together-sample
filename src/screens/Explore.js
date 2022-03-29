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
          alignItems: "flex-end",
          justifyContent: "flex-start",
          marginHorizontal: 20,
        }}
      >
        <Section>
          <SectionContent>
            <Button
              text="Check Invites"
              onPress={() => {
                navigation.navigate('Invite');
              }}
              style={{
                marginTop: 10,
              }}
            />
            <Button
              status="danger"
              text="Logout"
              onPress={() => {
                firebase.auth().signOut();
              }}
              style={{
                marginTop: 10,
              }}
            />
          </SectionContent>
        </Section>
      </View>
    <View
        style={{
            flex: 10,
            alignItems: 'center',
            justifyContent: 'center',
            marginHorizontal: 20,
        }}
    >
        <Text>Events and other cool things going on will be displayed here!</Text>
    </View>
    </Layout>
  );
}
