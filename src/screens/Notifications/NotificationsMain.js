import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Notifications from "./Notifications";
import NotificationFull from "./NotificationFull";
import ReportInvite from "./ReportInvite";

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
      <Stack.Screen name="ReportInvite" component={ReportInvite} />
    </Stack.Navigator>
  );
}
