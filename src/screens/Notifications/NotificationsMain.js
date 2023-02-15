import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Notifications from "./Notifications";
import NotificationFull from "./NotificationFull";
import ReportInvite from "./ReportInvite";
import Requests from "../Connections/Requests";
import ChatMain from "../Chat/ChatMain";

import FullCard from "../Profile/FullCard";
import FullProfile from "../Explore/People/FullProfile";
import Recommendation from "./Recommendation";

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
      <Stack.Screen name="FullCard" component={FullCard} />
      <Stack.Screen name="FullProfile" component={FullProfile} />
      <Stack.Screen name="Recommendation" component={Recommendation} />

      <Stack.Screen name="ReportInvite" component={ReportInvite} />
      <Stack.Screen name="Requests" component={Requests} />
      <Stack.Screen name="ChatMain" component={ChatMain} />
    </Stack.Navigator>
  );
}
