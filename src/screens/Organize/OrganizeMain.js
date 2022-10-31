import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Organize from "./Organize";
import InvitePeople from "./InvitePeople";
import FullProfile from "../Explore/People/FullProfile";

const Stack = createStackNavigator();

export default function () {
  return (
    <Stack.Navigator
      initialRouteName="Organize"
      screenOptions={{
        headerShown: false,
        animationEnabled: false,
      }}
    >
      <Stack.Screen name="Organize" component={Organize} />
      <Stack.Screen name="InvitePeople" component={InvitePeople} />
      <Stack.Screen name="FullProfile" component={FullProfile} />
    </Stack.Navigator>
  );
}
