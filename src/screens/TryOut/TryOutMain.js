import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Name from "../auth/Registration/Name";
import TryOut from "./TryOut";

const Stack = createStackNavigator();

export default function () {
  return (
    <Stack.Navigator
      initialRouteName="TryOut"
      screenOptions={{
        headerShown: false,
        animationEnabled: false,
      }}
    >
      <Stack.Screen name="TryOut" component={TryOut} />
      <Stack.Screen name="Name" component={Name} />
    </Stack.Navigator>
  );
}