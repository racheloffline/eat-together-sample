//Controls navigation functionality which includes everything that involves switching screens
//Sets up login permissions

import React, { useContext } from "react";
import firebase from "firebase/app";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { useTheme, themeColor } from "react-native-rapi-ui";
import TabBarIcon from "../components/utils/TabBarIcon";
import TabBarText from "../components/utils/TabBarText";
//Screens (Make sure to import if ever adding new screen!)
import Organize from "../screens/Organize";
import People from "../screens/People";
import Invite from "../screens/Invite"
import Me from "../screens/Me";
import Explore from "../screens/Explore";
import Loading from "../screens/utils/Loading";
//Auth screens
import Login from "../screens/auth/Login";
import Register from "../screens/auth/Register";
import ForgetPassword from "../screens/auth/ForgetPassword";
import { AuthContext } from "../provider/AuthProvider";

//Better put your these secret keys in .env file
//Connect to firebase
const firebaseConfig = {
  apiKey: "AIzaSyDYuhOpbDxlVHBKxVz6gW45eyutD26AsGg",
  authDomain: "eat-together-303ec.firebaseapp.com",
  databaseURL: "https://eat-together-303ec.firebaseio.com",
  projectId: "eat-together-303ec",
  storageBucket: "eat-together-303ec.appspot.com",
  messagingSenderId: "856869460838",
  appId: "1:856869460838:web:01e0197a0abc9fffb686a7",
};

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

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
      }}
    >
      <MainStack.Screen name="MainTabs" component={MainTabs} />
        <MainStack.Screen name="Invite" component={Invite} />

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
        component={Explore}
        options={{
          tabBarLabel: ({ focused }) => (
            <TabBarText focused={focused} title="Explore" />
          ),
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} icon={"md-home"} />
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
            <TabBarIcon focused={focused} icon={"md-home"} />
          ),
        }}
      />
      <Tabs.Screen
        name="People"
        component={People}
        options={{
          tabBarLabel: ({ focused }) => (
            <TabBarText focused={focused} title="People" />
          ),
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} icon={"md-home"} />
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
                    <TabBarIcon focused={focused} icon={"md-home"} />
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
