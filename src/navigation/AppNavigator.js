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
import ExploreMain from "../screens/Explore/ExploreMain";
import TryOut from "../screens/TryOut";
import ProfileMain from "../screens/Profile/ProfileMain";
import Loading from "../screens/utils/Loading";

//Auth screens
import Auth from "./Auth";
import { AuthContext } from "../provider/AuthProvider";

//Screen for if the user hasn't verified their email
import VerifyEmail from "../screens/VerifyEmail";
import firebase from "firebase/compat";
import { db, auth} from "../provider/Firebase";


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
    </MainStack.Navigator>
  );
};

//Controls the screens connected to the bottom navigation bar
const Tabs = createBottomTabNavigator();
const MainTabs = () => {
  const profileImageUri = useContext(AuthContext).profileImageUri;
  const user = auth.currentUser;
  const tryoutId = 'knVtYe1mtpaZ9D8XLDrS7FCImtm2';

  return (
    <Tabs.Navigator
      initialRouteName={"Explore"}
      screenOptions={{
        headerShown: false,
        animationEnabled: false,
        tabBarShowLabel: false,
        tabBarStyle: [
          {
            backgroundColor: "#ffffff",
          },
          null
        ]
      }}
    >
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
        component={user.uid == tryoutId ? TryOut : OrganizeMain}
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
        name="Profile"
        component={user.uid == tryoutId ? TryOut : ProfileMain}
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

    if (
      currUser &&
      currUser.emailVerified) {
      await db
        .collection("Users")
        .doc(currUser.uid)
        .update({
          verified: true,
          pushTokens: firebase.firestore.FieldValue.arrayUnion(token),
        });
    }

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
      !currUser.emailVerified ? (
        <VerifyEmail />
      ) : (
        user === true && <Main />
      )}
    </NavigationContainer>
  );
};
