import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Notifications from "./Notifications";
import NotificationFull from "./NotificationFull";

const Stack = createStackNavigator();

export default function () {
  return (
    <Stack.Navigator
      initialRouteName="Notifications"
      screenOptions={{
        headerShown: false,
        animationEnabled: false,
      }}
    >
      <Stack.Screen name="Notifications" component={Notifications} />
      <Stack.Screen name="NotificationFull" component={NotificationFull} />
    </Stack.Navigator>
  );
}
