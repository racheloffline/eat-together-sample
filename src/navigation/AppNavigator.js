//Controls navigation functionality which includes everything that involves switching screens
//Sets up login permissions

import React, { useState, useContext, useEffect } from "react";
import "firebase/firestore";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import TabBarIcon from "../components/utils/TabBarIcon";
import TabBarText from "../components/utils/TabBarText";
import ProfilePic from "../components/ProfilePic";

//Screens (Make sure to import if ever adding new screen!)
import OrganizeMain from "../screens/Organize/OrganizeMain";
import ChatMain from "../screens/Chat/ChatMain";
import ExploreMain from "../screens/Explore/ExploreMain";
import HomeMain from "../screens/Home/HomeMain";
import ProfileMain from "../screens/Profile/ProfileMain";
import NotificationsMain from "../screens/Notifications/NotificationsMain";
import Loading from "../screens/utils/Loading";

//Auth screens
import Auth from "./Auth";
import { AuthContext } from "../provider/AuthProvider";

//Screen for if the user hasn't verified their email
import VerifyEmail from "../screens/VerifyEmail";
import firebase from "firebase/compat";
import { db } from "../provider/Firebase";

//Push notifications functions and imports
import * as NotificationFunctions from "expo-notifications";

import DeviceToken from "../screens/utils/DeviceToken";

async function registerForPushNotificationsAsync() {
  let token;

  const { status: existingStatus } =
    await NotificationFunctions.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await NotificationFunctions.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    alert("Push notifications are not enabled.");
    return;
  }

  token = (await NotificationFunctions.getExpoPushTokenAsync()).data;

  return token;
}

//The experience of logged in user!!
const MainStack = createStackNavigator();
const Main = () => {
  return (
    <MainStack.Navigator
      screenOptions={{
        headerShown: false,
        animationEnabled: true,
      }}
    >
      <MainStack.Screen name="MainTabs">{() => <MainTabs />}</MainStack.Screen>
      <MainStack.Screen name="Notifications" component={NotificationsMain} />
    </MainStack.Navigator>
  );
};

//Controls the screens connected to the bottom navigation bar
const Tabs = createBottomTabNavigator();
const MainTabs = () => {
  const profileImageUri = useContext(AuthContext).profileImageUri;
  return (
    <Tabs.Navigator
      tabBarOptions={{
        style: {
          backgroundColor: "#ffffff",
        },
        showLabel: false,
      }}
    >
      <Tabs.Screen
        name="Home"
        component={HomeMain}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} icon={"home-outline"} title="Home" />
          ),
        }}
      />
      <Tabs.Screen
        name="Explore"
        component={ExploreMain}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              focused={focused}
              icon={"compass-outline"}
              title="Explore"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Organize"
        component={OrganizeMain}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              focused={focused}
              icon={"create-outline"}
              title="Organize"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Chat"
        component={ChatMain}
        options={{
          tabBarLabel: ({ focused }) => (
            <TabBarText focused={focused} title="Chat" />
          ),
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              focused={focused}
              icon={"chatbox-outline"}
              title="Chat"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Profile"
        component={ProfileMain}
        tabBarOptions={{
          showLabel: false,
        }}
        options={{
          tabBarIcon: () => <ProfilePic size={38} uri={profileImageUri} />,
        }}
      />
    </Tabs.Navigator>
  );
};

export default () => {
  const auth = useContext(AuthContext);
  const user = auth.user;
  const currUser = auth.currUser;

  async function getUser() {
    const token = await registerForPushNotificationsAsync();
    DeviceToken.setToken(token);

    if (
      currUser &&
      (currUser.emailVerified ||
        currUser.email === "rachelhu@uw.edu" ||
        currUser.email === "elaine@uw.edu" ||
        currUser.email === "argharib@uw.edu")
    ) {
      await db
        .collection("Users")
        .doc(currUser.uid)
        .update({
          verified: true,
          pushTokens: firebase.firestore.FieldValue.arrayUnion(token),
        });
    }

    //Register the push token by storing it in firebase, so cloud functions can use it
    await db
      .collection("Users")
      .doc(firebase.auth().currentUser.uid)
      .update({
        pushTokens: firebase.firestore.FieldValue.arrayUnion(token),
      });
  }

  // Prevent unecessary reloads of data
  useEffect(() => {
    getUser();
  }, []);

  return (
    <NavigationContainer>
      {user === null && <Loading />}
      {user === false && <Auth />}
      {user === true &&
      currUser &&
      !currUser.emailVerified &&
      currUser.email !== "rachelhu@uw.edu" &&
      currUser.email !== "elaine@uw.edu" &&
      currUser.email !== "argharib@uw.edu" ? (
        <VerifyEmail />
      ) : (
        user === true && <Main />
      )}
    </NavigationContainer>
  );
};
