//Controls navigation functionality which includes everything that involves switching screens
//Sets up login permissions

import React, { useContext } from "react";
import firebase from "firebase/app";
import "firebase/firestore"
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {firebaseConfig} from "../provider/Firebase";
import { useTheme, themeColor } from "react-native-rapi-ui";
import TabBarIcon from "../components/utils/TabBarIcon";
import TabBarText from "../components/utils/TabBarText";
//Screens (Make sure to import if ever adding new screen!)
import Organize from "../screens/Organize/OrganizePrivate";
import OrganizePublic from "../screens/Organize/OrganizePublic";
import InvitePeople from "../screens/Organize/InvitePeople";
import PeopleMain from "../screens/People/PeopleMain";
import Invite from "../screens/Invite"
import Me from "../screens/Me";
import ExploreMain from "../screens/Explore/ExploreMain";
import Loading from "../screens/utils/Loading";
import Schedule from "../screens/Profile/Schedule";
//Auth screens
import Login from "../screens/auth/Login";
import Register from "../screens/auth/Register";
import ForgetPassword from "../screens/auth/ForgetPassword";
import { AuthContext } from "../provider/AuthProvider";
import schedule from "../screens/Profile/Schedule";

//The experience of users not logged in
const AuthStack = createStackNavigator();
const Auth = () => {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <AuthStack.Screen name="Login" component={Login} />
      <AuthStack.Screen name="Register" component={Register} />
      <AuthStack.Screen name="ForgetPassword" component={ForgetPassword} />
    </AuthStack.Navigator>
  );
};

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
        <MainStack.Screen name="OrganizePublic" component={OrganizePublic} />
        <MainStack.Screen name="InvitePeople" component={InvitePeople} />

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
        component={Organize}
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
            component={Me}
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
  return (
    <NavigationContainer>
      {user == null && <Loading />}
      {user == false && <Auth />}
      {user == true && <Main />}
    </NavigationContainer>
  );
};
