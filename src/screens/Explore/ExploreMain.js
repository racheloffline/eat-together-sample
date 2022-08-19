import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Explore from "./Explore";
import FullCard from "./FullCard";
import PeopleMain from "./People/PeopleMain";

const Stack = createStackNavigator();

export default function () {
  return (
    <Stack.Navigator
      initialRouteName="Explore"
      screenOptions={{
        headerShown: false,
        animationEnabled: false,
      }}
    >
      <Stack.Screen name="Explore" component={Explore} />
      <Stack.Screen name="FullCard" component={FullCard} />
      <Stack.Screen name="People" component={PeopleMain} />
    </Stack.Navigator>
  );
}
