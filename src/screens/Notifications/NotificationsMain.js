import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Notifications from "./Notifications";
import NotificationFull from "./NotificationFull";
import ReportInvite from "./ReportInvite";
import ChatMain from "../Chat/ChatMain";

const Stack = createStackNavigator();

export default function ({ route }) {
  return (
    <Stack.Navigator
      initialRouteName="Notifications"
      screenOptions={{
        headerShown: false,
        animationEnabled: false,
      }}
    >
      <Stack.Screen name="Notifications">
        {props => <Notifications {...props} fromNav={route.params ? route.params.fromNav : true}/>}
      </Stack.Screen>
      <Stack.Screen name="NotificationFull" component={NotificationFull} />
      <Stack.Screen name="ReportInvite" component={ReportInvite} />
      <Stack.Screen name="ChatMain" component={ChatMain} />
    </Stack.Navigator>
  );
}
