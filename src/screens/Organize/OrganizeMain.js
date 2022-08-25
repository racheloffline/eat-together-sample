import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import OrganizePrivate from "./OrganizePrivate";
import OrganizePublic from "./OrganizePublic";
import InvitePeople from "./InvitePeople";
import FullProfile from "./FullProfile";

const Stack = createStackNavigator();

export default function () {
  return (
    <Stack.Navigator
      initialRouteName="OrganizePrivate"
      screenOptions={{
        headerShown: false,
        animationEnabled: true,
      }}
    >
      <Stack.Screen name="OrganizePrivate" component={OrganizePrivate} />
      <Stack.Screen name="OrganizePublic" component={OrganizePublic} />
      <Stack.Screen name="InvitePeople" component={InvitePeople} />
      <Stack.Screen name="FullProfile" component={FullProfile} />
    </Stack.Navigator>
  );
}
