import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import Explore from "./Explore";
import FullCard from "./FullCard";
import PeopleMain from "./People/PeopleMain";

const Stack = createStackNavigator();

export default function ({ navigation }) {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator initialRouteName="Explore">
        <Stack.Screen
          name="Explore"
          options={{ headerShown: false, animationEnabled: false }}
          component={Explore}
        />
        <Stack.Screen
          name="FullCard"
          options={{ headerShown: false }}
          component={FullCard}
        />
        <Stack.Screen
          name="People"
          options={{ headerShown: false }}
          component={PeopleMain}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
