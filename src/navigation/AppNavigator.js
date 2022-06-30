//Controls navigation functionality which includes everything that involves switching screens
//Sets up login permissions

import React, {useContext, useEffect} from "react";
import "firebase/firestore"
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import TabBarIcon from "../components/utils/TabBarIcon";
import TabBarText from "../components/utils/TabBarText";

//Screens (Make sure to import if ever adding new screen!)
import OrganizeMain from "../screens/Organize/OrganizeMain";
import PeopleMain from "../screens/People/PeopleMain";
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
import {db} from "../provider/Firebase";

//Push notifications functions and imports
import * as Notifications from 'expo-notifications'
import DeviceToken from "../screens/utils/DeviceToken";

async function registerForPushNotificationsAsync() {
    let token;

    const { status : existingStatus } = await Notifications.getPermissionsAsync();
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
    console.log(token);

    return token;
}

//The experience of logged in user!!
const MainStack = createStackNavigator();
const Main = () => {
  return (
    <MainStack.Navigator
      screenOptions={{
        headerShown: false,
          animationEnabled: false
      }}
    >
      <MainStack.Screen name="MainTabs" component={MainTabs} />
      <MainStack.Screen name="Schedule" component={Schedule} />
      <MainStack.Screen name="OrganizeMain" component={OrganizeMain}/>
    </MainStack.Navigator>
  );
};

//Controls the screens connected to the bottom navigation bar
const Tabs = createBottomTabNavigator();
const MainTabs = () => {
  return (
    <Tabs.Navigator
      tabBarOptions={{
        style: {
          borderTopWidth: 1,
          backgroundColor: "#ffffff",
        },
      }}
    >
      <Tabs.Screen
        name="Explore"
        component={ExploreMain}
        options={{
          tabBarLabel: ({ focused }) => (
            <TabBarText focused={focused} title="Explore" />
          ),
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} icon={"compass-outline"} />
          ),
        }}
      />
      <Tabs.Screen
        name="Organize"
        component={OrganizeMain}
        options={{
          tabBarLabel: ({ focused }) => (
            <TabBarText focused={focused} title="Organize" />
          ),
          tabBarIcon: ({ focused }) => (
              //The ionic library was imported, so we can use all kinds of default icons like "md-home"! Just search on https://ionic.io/
            <TabBarIcon focused={focused} icon={"create-outline"} />
          ),
        }}
      />
      <Tabs.Screen
        name="People"
        component={PeopleMain}
        options={{
          tabBarLabel: ({ focused }) => (
            <TabBarText focused={focused} title="People" />
          ),
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} icon={"people-outline"} />
          ),
        }}
      />
        <Tabs.Screen
            name="Me"
            component={ProfileMain}
            options={{
                tabBarLabel: ({ focused }) => (
                    <TabBarText focused={focused} title="Profile" />
                ),
                tabBarIcon: ({ focused }) => (
                    <TabBarIcon focused={focused} icon={"happy-outline"} />
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
  useEffect(async () => {
      const token = await registerForPushNotificationsAsync();
      DeviceToken.setToken(token);

      if (currUser && (currUser.emailVerified || currUser.email === "rachelhu@uw.edu" || currUser.email === "elaine@uw.edu" || currUser.email === "argharib@uw.edu")) {
          await db.collection("Users").doc(currUser.uid).update({
              verified: true,
              pushTokens: firebase.firestore.FieldValue.arrayUnion(token)
          })
      }

      //Register the push token by storing it in firebase, so cloud functions can use it
      await db.collection("Users").doc(firebase.auth().currentUser.uid).update({
          pushTokens: firebase.firestore.FieldValue.arrayUnion(token)
      })
  }, []);

  return (
    <NavigationContainer>
      {user === null && <Loading/>}
      {user === false && <Auth/>}
      {(user === true && currUser && !currUser.emailVerified && currUser.email !== "rachelhu@uw.edu" && currUser.email !== "elaine@uw.edu" && currUser.email !== "argharib@uw.edu") ? <VerifyEmail/>
        : user === true && <Main/>}
    </NavigationContainer>
  );
};
