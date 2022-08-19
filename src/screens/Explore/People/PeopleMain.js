import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import People from "./People";
import ReportPerson from "./ReportPerson";
import FullProfile from "./FullProfile";

const Stack = createStackNavigator();

export default function () {
  return (
    <Stack.Navigator
      initialRouteName="People"
      screenOptions={{
        headerShown: false,
        animationEnabled: false,
      }}
    >
      <Stack.Screen name="People" component={People} />
      <Stack.Screen name="FullProfile" component={FullProfile} />
      <Stack.Screen name="ReportPerson" component={ReportPerson} />
    </Stack.Navigator>
  );
}
