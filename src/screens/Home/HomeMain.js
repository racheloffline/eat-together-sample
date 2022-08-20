import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "./Home";
import WhileYouEat from "./WhileYouEat";
import ReportEvent from "./ReportEvent";
import EditEvent from "./EditEvent";

const Stack = createStackNavigator();

export default function () {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        animationEnabled: false,
      }}
    >
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="WhileYouEat" component={WhileYouEat} />
      <Stack.Screen name="ReportEvent" component={ReportEvent} />
      <Stack.Screen name="EditEvent" component={EditEvent} />
    </Stack.Navigator>
  );
}
