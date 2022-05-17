//Controls navigation functionality which includes everything that involves switching screens
//Sets up login permissions

import React, { useContext } from "react";
import "firebase/firestore"
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import TabBarIcon from "../components/utils/TabBarIcon";
import TabBarText from "../components/utils/TabBarText";

//Screens (Make sure to import if ever adding new screen!)
import OrganizeMain from "../screens/Organize/OrganizeMain";
import PeopleMain from "../screens/People/PeopleMain";
import Me from "../screens/Me";
import ExploreMain from "../screens/Explore/ExploreMain";
import Loading from "../screens/utils/Loading";

//Auth screens
import Auth from "./Auth";
import Schedule from "../screens/Profile/Schedule";
import { AuthContext } from "../provider/AuthProvider";

//Screen for if the user hasn't verified their email
import VerifyEmail from "../screens/VerifyEmail";

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
  const currUser = auth.currUser;
  
  return (
    <NavigationContainer>
      {user === null && <Loading/>}
      {user === false && <Auth/>}
      {(user === true && currUser && !currUser.emailVerified) ? <VerifyEmail/>
        : user === true && <Main/>}
    </NavigationContainer>
  );
};