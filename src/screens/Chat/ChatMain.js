import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Chats from "./Chats";
import ChatRoom from "./ChatRoom";

const Stack = createStackNavigator();

export default function () {
  return (
    <Stack.Navigator
      initialRouteName="Chats"
      screenOptions={{
        headerShown: false,
        animationEnabled: false,
      }}
    >
      <Stack.Screen name="Chats" component={Chats} />
      <Stack.Screen name="ChatRoom" component={ChatRoom} />
    </Stack.Navigator>
  );
}
