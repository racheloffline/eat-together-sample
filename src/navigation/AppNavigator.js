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
import PeopleMain from "../screens/Explore/People/PeopleMain";
import ExploreMain from "../screens/Explore/ExploreMain";
import Loading from "../screens/utils/Loading";

//Auth screens
import Auth from "./Auth";
import Schedule from "../screens/Profile/Schedule";
import { AuthContext } from "../provider/AuthProvider";

//Screen for if the user hasn't verified their email
import VerifyEmail from "../screens/VerifyEmail";
import ProfileMain from "../screens/Profile/ProfileMain";
import firebase from "firebase";
import { db } from "../provider/Firebase";

//Push notifications functions and imports
import * as Notifications from "expo-notifications";
import DeviceToken from "../screens/utils/DeviceToken";

async function registerForPushNotificationsAsync() {
  let token;

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    alert("Push notifications are not enabled.");
    return;
  }

  token = (await Notifications.getExpoPushTokenAsync()).data;

  return token;
}

//The experience of logged in user!!
const MainStack = createStackNavigator();
const Main = (props) => {
  return (
    <MainStack.Navigator
      screenOptions={{
        headerShown: false,
        animationEnabled: false,
      }}
    >
      <MainStack.Screen name="MainTabs">
        {() => <MainTabs profileImageUri={props.profileImageUri} />}
      </MainStack.Screen>
      <MainStack.Screen name="Schedule" component={Schedule} />
      <MainStack.Screen name="OrganizeMain" component={OrganizeMain} />
    </MainStack.Navigator>
  );
};

//Controls the screens connected to the bottom navigation bar
const Tabs = createBottomTabNavigator();
const MainTabs = (props) => {
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
        component={ExploreMain}
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
        component={PeopleMain}
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
          tabBarIcon: () => (
            <ProfilePic size={38} uri={props.profileImageUri} />
          ),
        }}
      />
    </Tabs.Navigator>
  );
};

export default () => {
  const auth = useContext(AuthContext);
  const user = auth.user;
  const currUser = auth.currUser;
  const [profileImageUri, setProfileImageUri] = useState(
    "https://static.wixstatic.com/media/d58e38_29c96d2ee659418489aec2315803f5f8~mv2.png"
  );

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

  // Function to get profile image for bottom bar icon
  function getProfilePicture(uid) {
    db.collection("Users").doc(uid).get().then(doc => {
      if (doc.data().hasImage) {
        setProfileImageUri(doc.data().image);
      }
    });
  }

  // Prevent unecessary reloads of data
  useEffect(() => {
    getUser();
    getProfilePicture(currUser.uid);
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
        user === true && <Main profileImageUri={profileImageUri} />
      )}
    </NavigationContainer>
  );
};
