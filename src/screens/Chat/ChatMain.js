import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Chats from "./Chats";
import ChatRoom from "./ChatRoom";
import ChatRoomDetails from "./ChatRoomDetails";
import FullProfile from "../Explore/People/FullProfile";

import Connections from "../Profile/Connections";
import Requests from "../Profile/Requests";
import FullCard from "../Explore/FullCard";
import ReportPerson from "../Explore/People/ReportPerson";
import ReportEvent from "../Home/ReportEvent";

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
      <Stack.Screen name="ChatRoomDetails" component={ChatRoomDetails}/>
      <Stack.Screen name="FullProfile" component={FullProfile}/>

      <Stack.Screen name="Connections" component={Connections}/>
      <Stack.Screen name="Requests">
        {props => <Requests {...props} back="Chats"/>}
      </Stack.Screen>
      <Stack.Screen name="FullCard" component={FullCard}/>
      <Stack.Screen name="ReportPerson" component={ReportPerson}/>
      <Stack.Screen name="ReportEvent" component={ReportEvent}/>
    </Stack.Navigator>
  );
}
